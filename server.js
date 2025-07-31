const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const { startMembershipUpdater } = require('./jobs/membershipUpdater');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
    if (req.url.includes('/images/') || req.url.includes('.png') || req.url.includes('.jpg')) {
        console.log(`📸 Image request: ${req.method} ${req.url}`);
        console.log(`📁 Looking for file: ${req.url}`);
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Log available static paths
console.log('📂 Static paths configured:');
console.log(`   Public: ${path.join(__dirname, 'public')}`);
console.log(`   Images: ${path.join(__dirname, 'images')}`);

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'cdf-elite-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Flash messages
app.use(flash());

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Root redirect
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/alumnos', require('./routes/alumnos'));
app.use('/planes', require('./routes/planes'));
app.use('/colaboradores', require('./routes/colaboradores'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash('error', 'Ha ocurrido un error. Por favor, intenta nuevamente.');
    res.redirect(req.headers.referer || '/');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Página no encontrada',
        user: req.session.userId
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Iniciar el actualizador automático de membresías
    startMembershipUpdater();
});
