
const { Alumno } = require('../config/database');
const { Op } = require('sequelize');

// Función para actualizar membresías vencidas
async function updateExpiredMemberships() {
    try {
        const now = new Date();
        
        // Actualizar membresías vencidas
        const [updatedCount] = await Alumno.update(
            { 
                estado_membresia: 'Vencida',
                membresia_pagada: false 
            },
            {
                where: {
                    fecha_vencimiento_membresia: {
                        [Op.lt]: now
                    },
                    estado_membresia: {
                        [Op.ne]: 'Vencida'
                    }
                }
            }
        );

        if (updatedCount > 0) {
            console.log(`✅ ${updatedCount} membresías actualizadas a estado "Vencida"`);
        }

        return updatedCount;
    } catch (error) {
        console.error('❌ Error actualizando membresías:', error);
        return 0;
    }
}

// Función para ejecutar el job cada cierto tiempo
function startMembershipUpdater() {
    console.log('🚀 Iniciando actualizador automático de membresías...');
    
    // Ejecutar inmediatamente
    updateExpiredMemberships();
    
    // Ejecutar cada hora (3600000 ms)
    setInterval(updateExpiredMemberships, 3600000);
}

module.exports = {
    updateExpiredMemberships,
    startMembershipUpdater
};
