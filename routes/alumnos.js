const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const alumnosController = require('../controllers/alumnosController');

// Alumnos routes
router.get('/', isAuth, alumnosController.index);
router.get('/api', isAuth, alumnosController.apiList);
router.get('/add', isAuth, alumnosController.addForm);
router.post('/add', isAuth, alumnosController.create);
router.get('/edit/:id', isAuth, alumnosController.editForm);
router.post('/edit/:id', isAuth, alumnosController.update);
router.delete('/:id', isAuth, alumnosController.delete);

module.exports = router;
