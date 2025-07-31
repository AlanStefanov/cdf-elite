const express = require('express');
const router = express.Router();
const { isAuth } = require('../middleware/auth');
const colaboradoresController = require('../controllers/colaboradoresController');

// Colaboradores routes
router.get('/', isAuth, colaboradoresController.index);
router.get('/add', isAuth, colaboradoresController.addForm);
router.post('/add', isAuth, colaboradoresController.add);
router.get('/edit/:id', isAuth, colaboradoresController.editForm);
router.post('/edit/:id', isAuth, colaboradoresController.edit);
router.post('/delete/:id', isAuth, colaboradoresController.delete);

module.exports = router;
