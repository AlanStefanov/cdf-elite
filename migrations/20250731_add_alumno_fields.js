const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Alumnos', 'direccion', {
            type: DataTypes.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('Alumnos', 'observaciones', {
            type: DataTypes.TEXT,
            allowNull: true
        });

        await queryInterface.addColumn('Alumnos', 'membresia_pagada', {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });

        await queryInterface.addColumn('Alumnos', 'fecha_pago', {
            type: DataTypes.DATE,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Alumnos', 'fecha_pago');
        await queryInterface.removeColumn('Alumnos', 'membresia_pagada');
        await queryInterface.removeColumn('Alumnos', 'observaciones');
        await queryInterface.removeColumn('Alumnos', 'direccion');
    }
};
