const { Alumno, Plan } = require('../config/database');
const { Op } = require('sequelize');

const alumnosController = {
    // Mostrar todos los alumnos
    index: async (req, res) => {
        try {
            const alumnos = await Alumno.findAll({
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: ['nombre_plan', 'precio']
                }],
                order: [['createdAt', 'DESC']]
            });

            // Calcular estadísticas
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // Recaudado este mes (pagos realizados)
            const recaudadoMes = await Alumno.sum('plan.precio', {
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: []
                }],
                where: {
                    membresia_pagada: true,
                    fecha_pago: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                }
            });

            // Ingresos potenciales (todas las membresías activas)
            const ingresosPotenciales = await Alumno.sum('plan.precio', {
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: []
                }],
                where: {
                    estado_membresia: 'Activa'
                }
            });

            // Membresías pagadas este mes
            const membresiasPagadas = await Alumno.count({
                where: {
                    membresia_pagada: true,
                    fecha_pago: {
                        [Op.between]: [firstDayOfMonth, lastDayOfMonth]
                    }
                }
            });

            const totalAlumnos = await Alumno.count({
                where: {
                    estado_membresia: 'Activa'
                }
            });

            const porcentajePagos = totalAlumnos > 0 ? ((membresiasPagadas / totalAlumnos) * 100).toFixed(1) : 0;

            res.render('alumnos/index', {
                title: 'Gestión de Alumnos',
                alumnos,
                recaudadoMes: recaudadoMes || 0,
                ingresosPotenciales: ingresosPotenciales || 0,
                membresiasPagadas,
                totalAlumnos,
                porcentajePagos,
                user: req.session.userId,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        } catch (error) {
            console.error('Error fetching alumnos:', error);
            req.flash('error', 'Error al cargar los alumnos');
            res.redirect('/dashboard');
        }
    },

    // Resto de métodos...
    add: async (req, res) => {
        try {
            const planes = await Plan.findAll();
            res.render('alumnos/add', {
                title: 'Agregar Alumno',
                planes,
                user: req.session.userId,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        } catch (error) {
            console.error('Error loading add form:', error);
            req.flash('error', 'Error al cargar el formulario');
            res.redirect('/alumnos');
        }
    },

    create: async (req, res) => {
        try {
            const { nombre, apellido, dni, email, telefono, fecha_nacimiento, id_plan } = req.body;

            const plan = await Plan.findByPk(id_plan);
            if (!plan) {
                req.flash('error', 'Plan no encontrado');
                return res.redirect('/alumnos/add');
            }

            const fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.duracion_dias);

            await Alumno.create({
                nombre,
                apellido,
                dni,
                email,
                telefono,
                fecha_nacimiento,
                id_plan,
                fecha_vencimiento_membresia: fechaVencimiento,
                estado_membresia: 'Activa'
            });

            req.flash('success', 'Alumno agregado exitosamente');
            res.redirect('/alumnos');
        } catch (error) {
            console.error('Error creating alumno:', error);
            req.flash('error', 'Error al agregar el alumno');
            res.redirect('/alumnos/add');
        }
    },

    edit: async (req, res) => {
        try {
            const alumno = await Alumno.findByPk(req.params.id, {
                include: [{
                    model: Plan,
                    as: 'plan'
                }]
            });

            if (!alumno) {
                req.flash('error', 'Alumno no encontrado');
                return res.redirect('/alumnos');
            }

            const planes = await Plan.findAll();

            res.render('alumnos/edit', {
                title: 'Editar Alumno',
                alumno,
                planes,
                user: req.session.userId,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        } catch (error) {
            console.error('Error loading edit form:', error);
            req.flash('error', 'Error al cargar el formulario');
            res.redirect('/alumnos');
        }
    },

    update: async (req, res) => {
        try {
            const { nombre, apellido, dni, email, telefono, fecha_nacimiento, id_plan, membresia_pagada } = req.body;

            const updateData = {
                nombre,
                apellido,
                dni,
                email,
                telefono,
                fecha_nacimiento,
                id_plan,
                membresia_pagada: membresia_pagada === 'true'
            };

            if (membresia_pagada === 'true') {
                updateData.fecha_pago = new Date();
            } else {
                updateData.fecha_pago = null;
            }

            await Alumno.update(updateData, {
                where: { id: req.params.id }
            });

            req.flash('success', 'Alumno actualizado exitosamente');
            res.redirect('/alumnos');
        } catch (error) {
            console.error('Error updating alumno:', error);
            req.flash('error', 'Error al actualizar el alumno');
            res.redirect(`/alumnos/edit/${req.params.id}`);
        }
    },

    delete: async (req, res) => {
        try {
            await Alumno.destroy({
                where: { id: req.params.id }
            });

            req.flash('success', 'Alumno eliminado exitosamente');
            res.redirect('/alumnos');
        } catch (error) {
            console.error('Error deleting alumno:', error);
            req.flash('error', 'Error al eliminar el alumno');
            res.redirect('/alumnos');
        }
    }
};

module.exports = alumnosController;