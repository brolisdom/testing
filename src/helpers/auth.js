const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

helpers.noAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        res.redirect('/home');
    } else{
        return next();
    }
}

module.exports = helpers;