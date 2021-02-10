const express = require('express');

const router = express.Router();

const mainController = require('./controllers/mainController');
const listController = require('./controllers/listController');
const cardController = require('./controllers/cardController');
const tagController = require('./controllers/tagController');


// LISTES
router.route('/lists')
    .get(listController.getAllLists)
    .post(listController.createList);
router.route('/lists/:id')
    .get(listController.getOneList)
    .patch(listController.updateList)
    .delete(listController.deleteList);

// CARTES
router.route('/lists/:id/cards')
    .get(cardController.getCardsInList);
router.route('/cards/:id')
    .get(cardController.getOneCard)
    .patch(cardController.updateCard)
    .delete(cardController.deleteCard);
router.route('/cards/')
    .post(cardController.createCard);

// TAGS
router.route('/tags/:id')
    .patch(tagController.updateTag)
    .delete(tagController.deleteTag);
router.route('/tags')
    .get(tagController.getAllTags)
    .post(tagController.createTag);
router.route('/cards/:id/tags')
    .post(tagController.addTagToCard);
router.route('/cards/:card_id/tags/:tag_id')
    .delete(tagController.removeTagFromCard);

router.use(mainController.notFound);

// Ce middleware ne s'executera qui s'il reçoit une objet d'erreur en en tant que premier argument
// Donc si cela provient d'un next() il n'utilise pas le controller
// Si cela provient d'un next(error) il utilisera le controller
router.use(mainController.errorServer);

module.exports = router;