const { Alumno, Plan, Colaborador } = require('../config/database');
const { Op } = require('sequelize');

const dashboardController = {
    index: async (req, res) => {
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            // Estadísticas principales
            const totalAlumnos = await Alumno.count();
            const totalPlanes = await Plan.count();
            const totalColaboradores = await Colaborador.count();

            // Membresías activas
            const membresiasActivas = await Alumno.count({
                where: {
                    estado_membresia: 'Activa'
                }
            });

            // Membresías vencidas
            const membresiasVencidas = await Alumno.count({
                where: {
                    estado_membresia: 'Vencida'
                }
            });

            // Recaudación mensual
            const recaudacionMensual = await Alumno.sum('plan.precio', {
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

            // Recaudación hoy
            const recaudacionHoy = await Alumno.sum('plan.precio', {
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: []
                }],
                where: {
                    membresia_pagada: true,
                    fecha_pago: {
                        [Op.between]: [today, tomorrow]
                    }
                }
            });

            // Membresías por vencer (próximos 7 días)
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);

            const porVencer = await Alumno.count({
                where: {
                    fecha_vencimiento_membresia: {
                        [Op.between]: [now, nextWeek]
                    },
                    estado_membresia: 'Activa'
                }
            });

            res.render('dashboard/index', {
                title: 'Dashboard - CDF Elite',
                totalAlumnos,
                totalPlanes,
                totalColaboradores,
                membresiasActivas,
                membresiasVencidas,
                recaudacionMensual: recaudacionMensual || 0,
                recaudacionHoy: recaudacionHoy || 0,
                porVencer,
                user: req.session.userId,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            req.flash('error', 'Error al cargar el dashboard');
            res.render('dashboard/index', {
                title: 'Dashboard - CDF Elite',
                totalAlumnos: 0,
                totalPlanes: 0,
                totalColaboradores: 0,
                membresiasActivas: 0,
                membresiasVencidas: 0,
                recaudacionMensual: 0,
                recaudacionHoy: 0,
                porVencer: 0,
                user: req.session.userId,
                messages: {
                    success: req.flash('success'),
                    error: req.flash('error')
                }
            });
        }
    }
};

module.exports = dashboardController;