const User = require('../models/User');

// Check if user is authenticated
const isAuth = (req, res, next) => {
    console.log('isAuth middleware:', {
        hasSession: !!req.session,
        hasUserId: !!req.session.userId,
        userId: req.session.userId,
        path: req.path
    });

    if (req.session.userId) {
        next();
    } else {
        console.log('isAuth: Redirecting to login');
        req.flash('error', 'Por favor inicia sesión');
        res.redirect('/login');
    }
};

// Check if user is not authenticated
const isNotAuth = (req, res, next) => {
    console.log('isNotAuth middleware:', {
        hasSession: !!req.session,
        hasUserId: !!req.session.userId,
        userId: req.session.userId,
        path: req.path
    });

    if (!req.session.userId) {
        next();
    } else {
        console.log('isNotAuth: Redirecting to dashboard');
        res.redirect('/dashboard');
    }
};

module.exports = {
    isAuth,
    isNotAuth
};
