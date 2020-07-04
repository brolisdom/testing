const {isAuthenticated} = require('../helpers/auth');
const {noAuthenticated} = require('../helpers/auth');
const {Router} = require('express');
const router = Router();

// controllers
const {
    signup,
    verified,
    login,
    logout,
    facebook,
    callback,
    google,
    enter,
    } = require('../controllers/users.controller');

// methods
router.post('/users/signup', signup);
router.get('/users/verified/:id', verified);
router.post('/users/login', login);
router.get('/users/logout', logout);
router.get('/users/facebook', facebook);
router.get('/users/facebook/callback', callback);
router.get('/users/google', google);
router.get('/users/enter', enter);

module.exports = router;