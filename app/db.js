const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_URL, {
    define: {
        // Afin de dire à sequelize que l'on utilise une convention de nommage en snake_case, on active l'option undescored
        underscored: true,
        //createdAt: 'created_at',
        //updatedAt : 'updated_at'
    }
});

module.exports = sequelize;