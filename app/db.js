const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        // Afin de dire à sequelize que l'on utilise une convention de nommage en snake_case, on active l'option undescored
        underscored: true,

        // Afin de modifier le nom de la propriété des champs en sorti de requête sequelize on précise des correspondances
        createdAt: 'created_at',
        updatedAt : 'updated_at'
    },
    logging:false,
});

module.exports = sequelize;