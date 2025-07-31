
const { Alumno, Plan, Colaborador } = require('../models');
const { Op } = require('sequelize');

exports.index = async (req, res) => {
    try {
        // Get counts
        const [totalAlumnos, totalPlanes, totalColaboradores] = await Promise.all([
            Alumno.count(),
            Plan.count(),
            Colaborador.count()
        ]);

        // Get active and expired members
        const now = new Date();
        const [activos, vencidos] = await Promise.all([
            Alumno.count({
                where: {
                    fecha_vencimiento_membresia: {
                        [Op.gte]: now
                    }
                }
            }),
            Alumno.count({
                where: {
                    fecha_vencimiento_membresia: {
                        [Op.lt]: now
                    }
                }
            })
        ]);

        // Get members per plan
        const planesConMiembros = await Plan.findAll({
            include: [{
                model: Alumno,
                as: 'alumnos',
                required: false
            }]
        });

        const planData = planesConMiembros.map(plan => ({
            nombre: plan.nombre_plan,
            miembros: plan.alumnos ? plan.alumnos.length : 0
        }));

        // Get members expiring in the next 7 days
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + 7);

        const membresiasPorVencer = await Alumno.findAll({
            where: {
                fecha_vencimiento_membresia: {
                    [Op.between]: [now, fechaLimite]
                }
            },
            include: [{
                model: Plan,
                as: 'plan',
                required: false
            }],
            order: [['fecha_vencimiento_membresia', 'ASC']]
        });

        const porVencer = membresiasPorVencer.length;

        // Calculate monthly revenue from active memberships
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const [membresiasPagadasMes, membresiasPagadasHoy] = await Promise.all([
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
            }),
            Alumno.findAll({
                where: {
                    membresia_pagada: true,
                    fecha_pago: {
                        [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate())
                    }
                },
                include: [{
                    model: Plan,
                    as: 'plan',
                    attributes: ['precio']
                }]
            })
        ]);

        const recaudacionMensual = membresiasPagadasMes.reduce((sum, alumno) => 
            sum + (alumno.plan ? parseFloat(alumno.plan.precio) : 0), 0
        );

        const recaudacionHoy = membresiasPagadasHoy.reduce((sum, alumno) => 
            sum + (alumno.plan ? parseFloat(alumno.plan.precio) : 0), 0
        );

        res.render('dashboard/index', {
            title: 'Dashboard - CDF Entrenamiento Elite',
            user: req.session.userId,
            stats: {
                totalAlumnos,
                totalPlanes,
                totalColaboradores,
                activos,
                vencidos,
                porVencer,
                recaudacionMensual,
                recaudacionHoy
            },
            planData,
            membresiasPorVencer,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        req.flash('error', 'Error al cargar el dashboard');
        res.redirect('/login');
    }
};
