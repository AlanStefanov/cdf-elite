const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Import models
const Alumno = require('../models/Alumno')(sequelize);
const Plan = require('../models/Plan')(sequelize);
const Colaborador = require('../models/Colaborador')(sequelize);
const User = require('../models/User')(sequelize);

// Initialize associations
require('../models/associations')(sequelize, { Alumno, Plan, Colaborador, User });

// Export models and sequelize instance
module.exports = {
    sequelize,
    Alumno,
    Plan,
    Colaborador,
    User
};
