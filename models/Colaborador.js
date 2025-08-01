
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Colaborador = sequelize.define('Colaborador', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('Profesor', 'Administrador', 'Recepcionista', 'Entrenador', 'Nutricionista', 'Fisioterapeuta'),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Colaborador;
};
