const { List } = require('../models');

/**
 * API REST vs RESTful
 * 
 * REST : On peut récupérer plusieurs entité avec leurs entités descendantes
 *  Avantages : 
 *          - on limite le nombre d'appels HTTP
 *          - on facilite la tâche de l'utilisateur
 *  Inconvéniants : 
 *          - on délivre potentiellement plus d'informations que nécessaire
 *          - on éxécute des requêtes potentiellment plus lentes que nécessaire
 * 
 * RESTful : On ne renvoi que l'e ou les entité demandés
 *  Avantages : 
 *          - on optimise les requêtes SQL
 *          - on ne retourne pas plus d'information que nécessaire
 *  Inconvénients : 
 *          - On multiplie les appels HTTP ce qui peut surcharger les serveur web et qui du coup multiplira le nombre de requêtes SQL
 *
 */

module.exports = {

    getAllLists: async (request, response, next) => {
        try {
            const lists = await List.findAll({
                include: ['cards',{
                    association: 'cards',
                    include: 'tags'
                }],
                // Grâce à l'option order je peux décider de l'ordre d'apparition de mes listes
                // @link : https://sequelize.org/master/manual/model-querying-basics.html#ordering
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ]
            });

            // Cela fonctionne également avec .send()
            // Le response.json comme le response.send écrit dans la réponse à l'utilisateur, la méthode json étant spécialisé dans l'affichage de json…
            // Lors de l'affichage des instances de list au format json, javascript ne va récupérer de ces instances, que les propriétés qui ont un getter (avec un peu de magie Sequelize)
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

            // Mettre à jour mon instance de classe List grâce aux setters
            // On va pas s'embeter a determiner pour chaque possibilité si on doit mettre l'info à jour ou non (imaginer une entité avec 30 colonnes…)
            // On boucle sur les donnée envoyés

            for (const field in data) {

                // On vérifie que ce champ est également présent dans l'entité récupéré
                // list[field] pourrait correspondre à list.name ou list.position
                // On est obligé de vérifier que le type n'est pas undefined, car si le nom de la liste est égal à 0 ou "" (qui sont des valeurs falsy) cela ne verifierai pas la condition, et ne mettrais plus jamais à jour les valeurs
                if (typeof list[field] !== 'undefined') {
                    // Cela pourrait être au final list.name = data.name
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