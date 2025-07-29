const Alumno = require('../models/Alumno');
const Plan = require('../models/Plan');
const Colaborador = require('../models/Colaborador');
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

        res.render('dashboard/index', {
            title: 'Dashboard - CDF Entrenamiento Elite',
            user: req.session.userId,
            stats: {
                totalAlumnos,
                totalPlanes,
                totalColaboradores,
                activos,
                vencidos,
                porVencer
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