const { Plan, Alumno } = require('../models');

// Define associations
Plan.hasMany(Alumno, {
    foreignKey: 'id_plan',
    as: 'alumnos'
});

Alumno.belongsTo(Plan, {
    foreignKey: 'id_plan',
    as: 'plan'
});

module.exports = { Plan, Alumno };
