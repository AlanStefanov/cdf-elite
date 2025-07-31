
const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Alumno = sequelize.define('Alumno', {
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
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_plan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Plans',
            key: 'id'
        }
    },
    fecha_vencimiento_membresia: {
        type: DataTypes.DATE,
        allowNull: false
    },
    estado_membresia: {
        type: DataTypes.ENUM('Activa', 'Vencida', 'Por vencer'),
        defaultValue: 'Activa'
    },
    membresia_pagada: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fecha_pago: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Alumnos',
    timestamps: true
});

const Plan = sequelize.define('Plan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_plan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT
    },
    duracion_dias: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    }
}, {
    tableName: 'Plans',
    timestamps: true
});

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
    dni: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    posicion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'Colaboradors',
    timestamps: true
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users',
    timestamps: true
});

// Define associations
Plan.hasMany(Alumno, {
    foreignKey: 'id_plan',
    as: 'alumnos'
});

Alumno.belongsTo(Plan, {
    foreignKey: 'id_plan',
    as: 'plan'
});

module.exports = {
    sequelize,
    Alumno,
    Plan, 
    Colaborador,
    User
};
