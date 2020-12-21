const List = require('./list');
const Card = require('./card');
const Label = require('./label');


// C'est là que l'on va dire à Sequelize comment sont liés nos entités

// Association 1:N entre 2 entités
List.hasMany(Card, {
    // On peut préciser des options pour cette associations

    // Ici on lui dit de mettre nos objets de cartes dans une propriété de liste appelé "cards" avec un S car il va y avoir potentiellement plusieurs cartes
    as: 'cards',
    // On lui précise la clé étrangère de l'entité card qui permet de l'associer à une liste
    foreignKey: 'list_id'
});

// Lorsque l'on configure les association, en général on défini également l'association dans l'autre sens. Ici la récuprocité d'un hasMany (à plusieurs) c'est belongsTo (appartient à un)
// Association N:1 entre 2 entités
Card.belongsTo(List, {
    as: 'list',
    foreignKey: 'list_id'
});

// Maintenant on doit mettre en place une relation N:N
// Ici on doit mettre en place une association ManyToMany
Card.belongsToMany(Label, {
    as: 'labels',
    // Ici on va devoir préciser plus d'informations, car il a besoin de connaitre la table d'association et comment l'utiliser
    // through : à travers
    through: 'card_has_label',
    foreignKey: 'card_id',
    otherKey: 'label_id',
    updatedAt: false
});

/// Comme il n'y a pas de sens l'inverse utilise la même méthode.
Label.belongsToMany(Card, {
    as: 'cards',
    through: 'card_has_label',
    // Par contre ici dans les options on peut et on doit inverser les informations
    foreignKey: 'label_id',
    otherKey: 'card_id',
    updatedAt: false
});


// On export sous-forme d'objet afin de permettre de recupérér ensuite uniquement les modèles nécessaires
module.exports = { List, Card, Label };