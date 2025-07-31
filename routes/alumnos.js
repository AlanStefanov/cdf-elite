const express = require('express');
const router = express.Router();
const alumnosController = require('../controllers/alumnosController');
const { isAuth } = require('../middleware/auth');
const { updateExpiredMemberships } = require('../jobs/membershipUpdater');

// Alumnos routes
router.get('/', isAuth, alumnosController.index);
router.get('/api', isAuth, alumnosController.apiData);
router.get('/api/data', isAuth, alumnosController.apiData);
router.get('/add', isAuth, alumnosController.addForm);
router.post('/add', isAuth, alumnosController.create);
router.get('/edit/:id', isAuth, alumnosController.editForm);
router.post('/edit/:id', isAuth, alumnosController.update);
router.delete('/:id', isAuth, alumnosController.delete);

// Delete alumno
router.post('/:id/delete', isAuth, alumnosController.delete);

// Manual membership update
router.post('/update-memberships', isAuth, async (req, res) => {
    try {
        const updatedCount = await updateExpiredMemberships();
        req.flash('success', `${updatedCount} membresías actualizadas correctamente`);
        res.redirect('/alumnos');
    } catch (error) {
        req.flash('error', 'Error al actualizar las membresías');
        res.redirect('/alumnos');
    }
});

module.exports = router;