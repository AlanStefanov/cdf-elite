const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

// Dashboard route
router.get('/', isAuth, dashboardController.index);

module.exports = router;
