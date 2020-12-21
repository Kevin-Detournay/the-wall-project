require('dotenv').config();

const { List } = require('./app/models');

// On va utilise une IIFE
(async () => {
    try {
        const lists = await List.findAll({
            include: {
                association: 'cards',
                include: 'labels'
            }
        });
        for(const list of lists){
            console.log(list.name, ' : ');
            for(const card of list.cards){
                console.log(`\t - ${card.content} (${card.labels.map(label => label.name)})`);
            }
        }
    } catch(error){
        console.trace(error);
    }
})()