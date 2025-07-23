const Alumno = require('../models/Alumno');
const Plan = require('../models/Plan');
const Colaborador = require('../models/Colaborador');

exports.index = async (req, res) => {
    try {
        // Get counts
        const [alumnos, planes, colaboradores] = await Promise.all([
            Alumno.count(),
            Plan.count(),
            Colaborador.count()
        ]);

        // Get active and expired members
        const [activos, vencidos] = await Promise.all([
            Alumno.count({
                where: {
                    estado_membresia: 'Activa'
                }
            }),
            Alumno.count({
                where: {
                    estado_membresia: 'Vencida'
                }
            })
        ]);

        // Get members per plan
        const planesConMiembros = await Plan.findAll({
            include: [{
                model: Alumno,
                as: 'alumnos'
            }]
        });

        const planData = planesConMiembros.map(plan => ({
            nombre: plan.nombre_plan,
            miembros: plan.alumnos.length
        }));

        res.render('dashboard/index', {
            title: 'Dashboard - CDF Entrenamiento Elite',
            alumnosCount: alumnos,
            alumnosActivos: activos,
            alumnosVencidos: vencidos,
            planesCount: planes,
            colaboradoresCount: colaboradores,
            planes: planData.map(p => p.nombre),
            planCounts: planData.map(p => p.miembros),
            user: req.session.userId
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        req.flash('error', 'Error al cargar el dashboard');
        res.redirect('/dashboard');
    }
};
