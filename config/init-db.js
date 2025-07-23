const sequelize = require('./database');
const { Plan, Alumno } = require('../models/associations');
const User = require('../models/User');
const Colaborador = require('../models/Colaborador');
const bcrypt = require('bcryptjs');

// Create tables
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true }); // Force: true will drop tables if they exist

        // Create initial admin user
        const hashedPassword = await bcrypt.hash('CDFElite2025**', 10);
        await User.create({
            username: 'administrador',
            password_hash: hashedPassword
        });

        // Create some initial plans
        await Plan.create({
            nombre_plan: 'Básico',
            precio: 10000,
            descripcion: 'Plan básico de entrenamiento',
            duracion_dias: 30
        });

        await Plan.create({
            nombre_plan: 'Premium',
            precio: 15000,
            descripcion: 'Plan premium con acceso a todas las instalaciones',
            duracion_dias: 30
        });

        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Run initialization
initializeDatabase();
