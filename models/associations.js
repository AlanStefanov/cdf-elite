
module.exports = (sequelize, models) => {
    const { Plan, Alumno } = models;

    // Define associations
    Plan.hasMany(Alumno, {
        foreignKey: 'id_plan',
        as: 'alumnos'
    });

    Alumno.belongsTo(Plan, {
        foreignKey: 'id_plan',
        as: 'plan'
    });

    return models;
};
