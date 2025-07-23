const Colaborador = require('../models/Colaborador');

// Display list of all colaboradores
exports.index = async (req, res) => {
    try {
        const colaboradores = await Colaborador.findAll({
            order: [['apellido', 'ASC']]
        });
        res.render('colaboradores/index', {
            title: 'Colaboradores - CDF Entrenamiento Elite',
            colaboradores,
            user: req.session.userId
        });
    } catch (error) {
        console.error('Error fetching colaboradores:', error);
        req.flash('error', 'Error al cargar los colaboradores');
        res.redirect('/dashboard');
    }
};

// Display add form
exports.addForm = (req, res) => {
    res.render('colaboradores/add', {
        title: 'Agregar Colaborador',
        user: req.session.userId
    });
};

// Process add form
exports.add = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            rol,
            email,
            telefono
        } = req.body;

        await Colaborador.create({
            nombre,
            apellido,
            rol,
            email,
            telefono
        });

        req.flash('success', 'Colaborador agregado exitosamente');
        res.redirect('/colaboradores');
    } catch (error) {
        console.error('Error adding colaborador:', error);
        req.flash('error', 'Error al agregar el colaborador');
        res.redirect('/colaboradores');
    }
};

// Display edit form
exports.editForm = async (req, res) => {
    try {
        const colaborador = await Colaborador.findByPk(req.params.id);

        if (!colaborador) {
            req.flash('error', 'Colaborador no encontrado');
            return res.redirect('/colaboradores');
        }

        res.render('colaboradores/edit', {
            title: 'Editar Colaborador',
            colaborador,
            user: req.session.userId
        });
    } catch (error) {
        console.error('Error fetching colaborador:', error);
        req.flash('error', 'Error al cargar el colaborador');
        res.redirect('/colaboradores');
    }
};

// Process edit form
exports.edit = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            rol,
            email,
            telefono
        } = req.body;

        const colaborador = await Colaborador.findByPk(req.params.id);
        if (!colaborador) {
            req.flash('error', 'Colaborador no encontrado');
            return res.redirect('/colaboradores');
        }

        await colaborador.update({
            nombre,
            apellido,
            rol,
            email,
            telefono
        });

        req.flash('success', 'Colaborador actualizado exitosamente');
        res.redirect('/colaboradores');
    } catch (error) {
        console.error('Error updating colaborador:', error);
        req.flash('error', 'Error al actualizar el colaborador');
        res.redirect('/colaboradores');
    }
};

// Delete colaborador
exports.delete = async (req, res) => {
    try {
        const colaborador = await Colaborador.findByPk(req.params.id);
        if (!colaborador) {
            req.flash('error', 'Colaborador no encontrado');
            return res.redirect('/colaboradores');
        }

        await colaborador.destroy();
        req.flash('success', 'Colaborador eliminado exitosamente');
        res.redirect('/colaboradores');
    } catch (error) {
        console.error('Error deleting colaborador:', error);
        req.flash('error', 'Error al eliminar el colaborador');
        res.redirect('/colaboradores');
    }
};
