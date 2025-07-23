const Plan = require('../models/Plan');

// Display list of all planes
exports.index = async (req, res) => {
    try {
        const planes = await Plan.findAll({
            order: [['nombre_plan', 'ASC']]
        });
        res.render('planes/index', {
            title: 'Planes - CDF Entrenamiento Elite',
            planes,
            user: req.session.userId
        });
    } catch (error) {
        console.error('Error fetching planes:', error);
        req.flash('error', 'Error al cargar los planes');
        res.redirect('/dashboard');
    }
};

// Display add form
exports.addForm = (req, res) => {
    res.render('planes/add', {
        title: 'Agregar Plan',
        user: req.session.userId
    });
};

// Process add form
exports.add = async (req, res) => {
    try {
        const {
            nombre_plan,
            precio,
            descripcion,
            duracion_dias
        } = req.body;

        await Plan.create({
            nombre_plan,
            precio: parseFloat(precio),
            descripcion,
            duracion_dias: parseInt(duracion_dias)
        });

        req.flash('success', 'Plan agregado exitosamente');
        res.redirect('/planes');
    } catch (error) {
        console.error('Error adding plan:', error);
        req.flash('error', 'Error al agregar el plan');
        res.redirect('/planes');
    }
};

// Display edit form
exports.editForm = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);

        if (!plan) {
            req.flash('error', 'Plan no encontrado');
            return res.redirect('/planes');
        }

        res.render('planes/edit', {
            title: 'Editar Plan',
            plan,
            user: req.session.userId
        });
    } catch (error) {
        console.error('Error fetching plan:', error);
        req.flash('error', 'Error al cargar el plan');
        res.redirect('/planes');
    }
};

// Process edit form
exports.edit = async (req, res) => {
    try {
        const {
            nombre_plan,
            precio,
            descripcion,
            duracion_dias
        } = req.body;

        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
            req.flash('error', 'Plan no encontrado');
            return res.redirect('/planes');
        }

        await plan.update({
            nombre_plan,
            precio: parseFloat(precio),
            descripcion,
            duracion_dias: parseInt(duracion_dias)
        });

        req.flash('success', 'Plan actualizado exitosamente');
        res.redirect('/planes');
    } catch (error) {
        console.error('Error updating plan:', error);
        req.flash('error', 'Error al actualizar el plan');
        res.redirect('/planes');
    }
};

// Delete plan
exports.delete = async (req, res) => {
    try {
        const plan = await Plan.findByPk(req.params.id);
        if (!plan) {
            req.flash('error', 'Plan no encontrado');
            return res.redirect('/planes');
        }

        await plan.destroy();
        req.flash('success', 'Plan eliminado exitosamente');
        res.redirect('/planes');
    } catch (error) {
        console.error('Error deleting plan:', error);
        req.flash('error', 'Error al eliminar el plan');
        res.redirect('/planes');
    }
};
