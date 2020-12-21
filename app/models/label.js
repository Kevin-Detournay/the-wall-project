const sequelize = require('../db');

const { Model, DataTypes } = require('sequelize');

class Label extends Model { }

Label.init({
    name: DataTypes.TEXT,
    color: DataTypes.TEXT
}, {
    sequelize,
    tableName: 'label'
});

module.exports = Label;