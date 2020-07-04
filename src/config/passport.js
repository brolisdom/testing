const key = require('./key');
const passport = require('passport');
const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');

passport.use(new FacebookStrategy({
    callbackURL: '/users/facebook/callback', //cambiar
    clientID: key.facebook.clientID,
    clientSecret: key.facebook.clientSecret,
    profileFields: ['id', 'emails', 'name']
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile._json);
    User.findOne({facebook: profile._json.id}).then((currentUser) => {
        if(currentUser){
            return done(null, currentUser);
        } else{
            User.findOne({email: profile._json.email}).then((currentEmail) => {
                if(currentEmail){
                    return done(null, false, {message: 'El correo ya esta asociado con otra cuenta'});
                } else{
                    new User({
                        facebook: profile._json.id,
                        email: profile._json.email,
                        role: 'Normal',
                        verified: true
                    }).save().then((newUser) => {
                        return done(null, newUser);
                    });
                }
            });
        }
    });
}))

passport.use(new GoogleStrategy({
    callbackURL: '/users/enter', //cambiar
    clientID: key.google.clientID,
    clientSecret: key.google.clientSecret ,
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile._json);
    User.findOne({google: profile._json.sub}).then((currentUser) => {
        if(currentUser){
            return done(null, currentUser);
        } else{
            User.findOne({email: profile._json.email}).then((currentEmail) => {
                if(currentEmail){
                    return done(null, false, {message: 'El correo ya esta asociado con otra cuenta'});
                } else{
                    new User({
                        google: profile._json.sub,
                        email: profile._json.email,
                        role: 'Normal',
                        verified: true
                    }).save().then((newUser) => {
                        return done(null, newUser);
                    });
                }
            });
        }
    });
}))

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const user = await User.findOne({email});
    if(!user){
        return done(null, false, {message: 'El correo no esta registrado'});
    } else{
        const match = await user.compare(password);
        if(match){
            if(user.verified){
                return done(null, user);
            } else{
                return done(null, false, {message: 'El correo no ha sido verificado'});
            }
        } else{
            return done(null, false, {message: 'La contraseña ingresada es incorrecta'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user) => {
        done(err, user);
    });
})