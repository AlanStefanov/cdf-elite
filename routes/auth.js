const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../config/database');
const { isNotAuth } = require('../middleware/auth');

// Login page
router.get('/login', isNotAuth, (req, res) => {
    res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
});

// Login POST
router.post('/login', isNotAuth, async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });

        if (!user) {
            req.flash('error', 'Usuario o contraseña incorrectos');
            return res.redirect('/login');
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            req.flash('error', 'Usuario o contraseña incorrectos');
            return res.redirect('/login');
        }

        // Create session
        req.session.userId = user.id;

        req.flash('success', `¡Bienvenido, ${user.username}!`);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Error al iniciar sesión');
        res.redirect('/login');
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;