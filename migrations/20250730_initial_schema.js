const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
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
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });

        await queryInterface.createTable('Plans', {
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
            duracion_dias: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });

        await queryInterface.createTable('Alumnos', {
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
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });

        await queryInterface.createTable('Colaboradores', {
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
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
        await queryInterface.dropTable('Plans');
        await queryInterface.dropTable('Alumnos');
        await queryInterface.dropTable('Colaboradores');
    }
};
