const path = require('path');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars');
const {isAuthenticated} = require('./helpers/auth');
const {noAuthenticated} = require('./helpers/auth');

const flash = require('connect-flash');
const methodOverride = require('method-override');

// inicializations
const app = express();
require('./config/passport');

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));

// handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    layaoutDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',

    // helpers
    helpers: {
        equal: function(value1, value2, options) {
            if(value1 === value2) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'palabra-secreta', //modificar
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.exito = req.flash('exito');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// routes
app.get('/', noAuthenticated, (req, res) => {
    res.render('index')
});
app.get('/home', isAuthenticated, (req, res) => {
    res.render('dashboard')
});
app.use(require('./routes/users.routes'));
// app.use(require('./routes/teams.routes'));
// app.use(require('./routes/robots.routes'));
// app.use(require('./routes/members.routes'));

// static files
app.use(express.static(path.join(__dirname,'public')));

module.exports = app;