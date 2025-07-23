const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Export the instance of Sequelize
module.exports = sequelize;

// Import models
const Alumno = require('../models/Alumno');
const Plan = require('../models/Plan');
const Colaborador = require('../models/Colaborador');
const User = require('../models/User');

// Initialize associations
require('../models/associations');
