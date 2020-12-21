const sequelize = require('../db');

const { Model, DataTypes } = require('sequelize');

class List extends Model { }

// La classe Model nous fourni les outil pour définir la structure de nos tables, ici on utilise la méthode statique appelé "init"
// Rappel : pour utiliser une méthode statique on a pas besoin d'instancié la classe. Ce qui veut dire éalement que l'on ne peut accéder ou mettre à jour QUE des proriété statiques.
List.init({
    // 1ère argument : objet qui défini la structure du model (la table)
    /*
    en valeur de chaque propriété, on peut au choix fournir l'information sous forme d'objet ou pas
    {
        type:DataTypes.TEXT
    }
    Si l'on ne configure QUE le type du champs, cela n'est pas nécessaire
    */
    name: DataTypes.TEXT,
    position: DataTypes.INTEGER
}, {
    // 2ème argument qui défini les options. Parmis celle-ci 2 obligatoires
    //le connecteur de BDD
    sequelize,
    // Le nom de la table dans la BDD
    tableName: 'list'
});

module.exports = List;