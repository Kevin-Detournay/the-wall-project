
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(config.get('database.database'), config.get('database.username'), config.get('database.password'), {
  
    define: {
        // Afin de dire à sequelize que l'on utilise une convention de nommage en snake_case, on active l'option undescored
        underscored: true,
        
        // Afin de modifier le nom de la propriété des champs en sorti de requête sequelize on précise des correspondances
        createdAt: 'created_at',
        updatedAt : 'updated_at'
    },
    dialect:  'postgres',
    protocol: 'postgres',
    port:     config.get('database.port'),
    host:     config.get('database.host'),
    logging:  debug, //false

    dialectOptions: {
        ssl: true
    },

    pool: {
        max: 20,
        min: 0,
        idle: 5000
    }
});


module.exports = sequelize;