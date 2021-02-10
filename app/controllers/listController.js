const { List } = require('../models');



module.exports = {

    getAllLists: async (request, response, next) => {
        try {
            const lists = await List.findAll({
                include: ['cards',{
                    association: 'cards',
                    include: 'tags'
                }],
                
                // @link : https://sequelize.org/master/manual/model-querying-basics.html#ordering
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ]
            });

          
            response.json(lists);
        } catch (error) {
            next(error);
        }
    },

    getOneList: async (request, response, next) => {

        const id = Number(request.params.id);

        // Si l'id reçu n'est pas un nombre on envoi un message d'erreur personnalisé
        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            const list = await List.findByPk(id, {
                include: {
                    association: 'cards',
                    include: 'tags'
                }
            });

            // Si l'on a pas trouvé de list on revoi vers le middleware 404
            if (!list) {
                return next();
            }

            response.json(list);
        } catch (error) {
            // Si une erreur serveur se produit, on renvoi vers le middleware des gestion d'erreurs en envoyant en argument l'objet d'erreur
            next(error);
        }
    },

    createList: async (request, response, next) => {
        const data = request.body;

        if (!data.name) {
            return response.status(400).json({
                error: `You must provide a name`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }

        try {
            // première possibilté
            const list = await List.create(data);
            // Deuxième possibilté

            // !Attention ne pas créer l'instance façon JS natif, mais utiliser la méthode de sequelize qui permet de générer les champs created_at et updated_at
            /*
            const list = await List.build(data);
            await list.save();
            */
            response.json(list);

        } catch (error) {
            next(error);
        }
    },

    updateList: async (request, response, next) => {

        const data = request.body;

        const id = Number(request.params.id);

        // Si l'id reçu n'est pas un nombre on envoi un message d'erreur personnalisé
        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        if (data.position && isNaN(Number(data.position))) {
            return response.status(400).json({
                error: `position must be a number`
            });
        }

        if (!data.name) {
            return response.status(400).json({
                error: `You must provide a name`
            });
        }

        try {
            // On récupère une instance de classe List
            const list = await List.findByPk(id);
            if (!list) {
                next();
            }

            
            for (const field in data) {

                
                if (typeof list[field] !== 'undefined') {
                    
                    list[field] = data[field];
                }

            }
            // Je peux maintenant activer la mise à jour en BDD
            await list.save();
            response.json(list);
        } catch (error) {
            next(error);
        }

    },

    deleteList: async (request, response, next) => {

        const id = Number(request.params.id);

        if (isNaN(id)) {
            return response.status(400).json({
                error: `the provided id must be a number`
            });
        }

        try {
            // On récupère une instance de classe List
            const list = await List.findByPk(id);
            if (!list) {
                return next();
            }

            await list.destroy();
            response.json('OK');

        } catch (error) {
            next(error);
        }

    },

}