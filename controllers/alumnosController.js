const Alumno = require('../models/Alumno');
const Plan = require('../models/Plan');

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
        const alumnos = await Alumno.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Add formatted dates and membership status
        const formattedAlumnos = alumnos.map(alumno => ({
            ...alumno.toJSON(),
            fecha_nacimiento: formatDate(alumno.fecha_nacimiento),
            fecha_vencimiento_membresia: formatDate(alumno.fecha_vencimiento_membresia),
            estado_membresia: new Date() > new Date(alumno.fecha_vencimiento_membresia) ? 'Vencida' : 'Activa'
        }));

        res.render('alumnos/index', {
            title: 'Alumnos - CDF Entrenamiento Elite',
            alumnos: formattedAlumnos
        });
    } catch (error) {
        console.error('Error fetching alumnos:', error);
        res.status(500).json({ error: 'Error al cargar la lista de alumnos' });
    }
};

// API endpoint for Tabulator
exports.apiList = async (req, res) => {
    try {
        const alumnos = await Alumno.findAll({
            order: [['createdAt', 'DESC']]
        });

        const data = alumnos.map(alumno => ({
            id: alumno.id,
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            dni: alumno.dni,
            email: alumno.email,
            telefono: alumno.telefono,
            fecha_nacimiento: formatDate(alumno.fecha_nacimiento),
            fecha_vencimiento_membresia: formatDate(alumno.fecha_vencimiento_membresia),
            plan: {
                nombre_plan: '' // Empty string by default
            },
            estado_membresia: new Date() > new Date(alumno.fecha_vencimiento_membresia) ? 'Vencida' : 'Activa'
        }));

        res.json({
            data: data
        });
    } catch (error) {
        console.error('Error fetching alumnos for API:', error);
        res.status(500).json({
            error: 'Error al obtener la lista de alumnos'
        });
    }
};

// Display add form
exports.addForm = async (req, res) => {
    try {
        const planes = await Plan.findAll();
        res.render('alumnos/add', {
            title: 'Agregar Alumno - CDF Entrenamiento Elite',
            planes
        });
    } catch (error) {
        console.error('Error fetching planes:', error);
        res.status(500).json({ error: 'Error al cargar los planes' });
    }
};

// Process add form
exports.create = async (req, res) => {
    try {
        const { nombre, apellido, dni, email, telefono, fecha_nacimiento, id_plan } = req.body;
        
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

        // Calculate membership expiration
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + plan.duracion_dias);

        const newAlumno = await Alumno.create({
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

        res.status(201).json({ message: 'Alumno agregado exitosamente' });
    } catch (error) {
        console.error('Error creating alumno:', error);
        res.status(500).json({ error: error.message || 'Error al agregar el alumno' });
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
        if (alumno.id_plan !== id_plan) {
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
