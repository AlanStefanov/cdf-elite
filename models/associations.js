
module.exports = (sequelize, models) => {
    const { Plan, Alumno, Colaborador, User } = models;

    // Plan - Alumno relationship
    Plan.hasMany(Alumno, {
        foreignKey: 'id_plan',
        as: 'alumnos'
    });

    Alumno.belongsTo(Plan, {
        foreignKey: 'id_plan',
        as: 'plan'
    });

    return { Plan, Alumno, Colaborador, User };
};
