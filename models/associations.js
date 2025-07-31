
const { Plan, Alumno, Colaborador, User } = require('./index');

// Plan - Alumno relationship
Plan.hasMany(Alumno, {
    foreignKey: 'id_plan',
    as: 'alumnos'
});

Alumno.belongsTo(Plan, {
    foreignKey: 'id_plan',
    as: 'plan'
});

module.exports = {
    Plan,
    Alumno,
    Colaborador,
    User
};
