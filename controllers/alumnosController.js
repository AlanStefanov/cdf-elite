const { Alumno, Plan } = require('../config/database');
const { Op } = require('sequelize');

// Helper function to format date
const formatDate = (date) => {
    if (!date) return '';
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    return new Date(date).toLocaleDateString('es-ES', options);
};

// Display list of all alumnos
exports.index = async (req, res) => {
    try {
        // Get monthly revenue
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [totalAlumnos, recaudacionMensual] = await Promise.all([
            Alumno.findAll({
                where: {
                    estado_membresia: 'Activa'
                },
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: ['precio']
                }]
            }),
            Alumno.findAll({
                where: {
                    membresia_pagada: true,
                    fecha_pago: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                },
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: ['precio']
                }]
            })
        ]);

        // Calculate monthly revenue
        const totalRecaudado = recaudacionMensual.reduce((sum, alumno) => 
            sum + (alumno.plan ? alumno.plan.precio : 0), 0
        );

        res.render('alumnos/index', {
            title: 'Alumnos - CDF Entrenamiento Elite',
            user: req.session.userId,
            recaudacionMensual: totalRecaudado
        });
    } catch (error) {
        console.error('Error rendering alumnos page:', error);
        req.flash('error', 'Error al cargar los alumnos');
        res.redirect('/dashboard');
    }
};

// API endpoint for DataGrid
exports.apiData = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({
            include: [{
                model: Plan,
                as: 'plan',
                attributes: ['nombre_plan']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Format data for DataGrid and add membership status
        const formattedAlumnos = alumnos.map(alumno => {
            const now = new Date();
            const vencimiento = new Date(alumno.fecha_vencimiento_membresia);
            
            // Usar el estado de la base de datos, pero verificar si está por vencer
            let estado = alumno.estado_membresia;
            
            if (estado === 'Activa' && vencimiento <= new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))) {
                estado = 'Por vencer';
            }

            return {
                id: alumno.id,
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                dni: alumno.dni,
                email: alumno.email,
                telefono: alumno.telefono,
                fecha_nacimiento: formatDate(alumno.fecha_nacimiento),
                plan: alumno.plan ? alumno.plan.nombre_plan : 'Sin plan',
                fecha_vencimiento_membresia: formatDate(alumno.fecha_vencimiento_membresia),
                estado_membresia: estado,
                membresia_pagada: alumno.membresia_pagada,
                fecha_pago: formatDate(alumno.fecha_pago),
                direccion: alumno.direccion,
                observaciones: alumno.observaciones
            };
        });

        console.log('Sending alumnos data:', formattedAlumnos.length, 'alumnos');
        res.json(formattedAlumnos);
    } catch (error) {
        console.error('Error fetching alumnos API data:', error);
        res.status(500).json([]);
    }
};



// Display add form
exports.addForm = async (req, res) => {
    try {
        const planes = await Plan.findAll({
            order: [['nombre_plan', 'ASC']]
        });
        
        res.render('alumnos/add', {
            title: 'Agregar Alumno - CDF Entrenamiento Elite',
            user: req.session.userId,
            planes,
            error: req.flash('error')[0],
            success: req.flash('success')[0]
        });
    } catch (error) {
        console.error('Error fetching planes:', error);
        req.flash('error', 'Error al cargar los planes');
        res.redirect('/alumnos');
    }
};

// Process add form
exports.create = async (req, res) => {
    try {
        // Validate date format
        const fechaPago = req.body.fecha_pago ? new Date(req.body.fecha_pago) : null;
        if (fechaPago && isNaN(fechaPago.getTime())) {
            throw new Error('Formato de fecha inválido');
        }
        const { nombre, apellido, dni, email, telefono, fecha_nacimiento, id_plan, fecha_vencimiento_membresia } = req.body;

        // Validate required fields
        if (!nombre || !apellido || !dni || !email || !telefono || !fecha_nacimiento || !id_plan) {
            req.flash('error', 'Todos los campos son requeridos');
            return res.redirect('/alumnos/add');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Formato de email inválido');
            return res.redirect('/alumnos/add');
        }

        const plan = await Plan.findByPk(id_plan);
        if (!plan) {
            req.flash('error', 'Plan no encontrado');
            return res.redirect('/alumnos/add');
        }

        // Use provided expiration date or calculate it
        let fechaVencimiento;
        if (fecha_vencimiento_membresia) {
            fechaVencimiento = new Date(fecha_vencimiento_membresia);
        } else {
            fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.duracion_dias);
        }

        // Validate that the expiration date is not in the past
        if (fechaVencimiento < new Date()) {
            req.flash('error', 'La fecha de vencimiento no puede ser anterior a hoy');
            return res.redirect('/alumnos/add');
        }

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
        if (error.name === 'SequelizeUniqueConstraintError') {
            req.flash('error', 'Ya existe un alumno con ese DNI o email');
        } else {
            req.flash('error', 'Error al agregar el alumno');
        }
        res.redirect('/alumnos/add');
    }
};

// Display edit form
exports.editForm = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByPk(id, {
            include: [{
                model: Plan,
                as: 'plan',
                attributes: ['nombre_plan']
            }]
        });

        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }

        const planes = await Plan.findAll();
        res.render('alumnos/edit', {
            title: 'Editar Alumno - CDF Entrenamiento Elite',
            alumno,
            planes
        });
    } catch (error) {
        console.error('Error fetching alumno:', error);
        res.status(500).json({ error: 'Error al cargar el alumno' });
    }
};

// Process edit form
exports.update = async (req, res) => {
    try {
        // Validate date format
        const fechaPago = req.body.fecha_pago ? new Date(req.body.fecha_pago) : null;
        if (fechaPago && isNaN(fechaPago.getTime())) {
            throw new Error('Formato de fecha inválido');
        }
        const { id } = req.params;
        const { nombre, apellido, dni, email, telefono, fecha_nacimiento, id_plan } = req.body;

        const alumno = await Alumno.findByPk(id);
        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }

        const plan = await Plan.findByPk(id_plan);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }

        // Validate required fields
        if (!nombre || !apellido || !dni || !email || !telefono || !fecha_nacimiento) {
            throw new Error('Todos los campos son requeridos');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Formato de email inválido');
        }

        // Update membership expiration if plan changed
        let fechaVencimiento = new Date(alumno.fecha_vencimiento_membresia);
        if (parseInt(alumno.id_plan) !== parseInt(id_plan)) {
            fechaVencimiento = new Date();
            fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.duracion_dias);
        }

        await alumno.update({
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

        req.flash('success', 'Alumno actualizado exitosamente');
        res.redirect('/alumnos');
    } catch (error) {
        console.error('Error updating alumno:', error);
        req.flash('error', error.message || 'Error al actualizar el alumno');
        res.redirect('/alumnos');
    }
};

// Delete alumno
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByPk(id);

        if (!alumno) {
            throw new Error('Alumno no encontrado');
        }

        await alumno.destroy();
        req.flash('success', 'Alumno eliminado exitosamente');
        res.redirect('/alumnos');
    } catch (error) {
        console.error('Error deleting alumno:', error);
        req.flash('error', error.message || 'Error al eliminar el alumno');
        res.redirect('/alumnos');
    }
};