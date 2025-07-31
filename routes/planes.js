const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const planesController = require('../controllers/planesController');

// Planes routes
router.get('/', isAuth, planesController.index);

// API endpoint for plans
router.get('/api', isAuth, planesController.apiData);

// Display add form
router.get('/add', isAuth, planesController.addForm);
router.post('/add', isAuth, planesController.add);
router.get('/edit/:id', isAuth, planesController.editForm);
router.post('/edit/:id', isAuth, planesController.edit);
router.post('/delete/:id', isAuth, planesController.delete);

module.exports = router;