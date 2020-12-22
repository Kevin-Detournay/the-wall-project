const express = require('express');

const router = express.Router();

const mainController = require('./controllers/mainController');
const listController = require('./controllers/listController');

/*
router.get('/lists', listController.getAllList);
router.post('/lists', listController.getAllList);
Ce qui suit correspond exactement a ce qu'il y a ci-dessus.
C'est juste écrit de façon plus optimale, grâce à la méthode route()
*/
router.route('/lists')
    .get(listController.getAllList)
    .post(listController.createList);

router.route('/lists/:id')
    .get(listController.getOneList)
    .patch(listController.updateList)
    .delete(listController.deleteList);

router.use(mainController.notFound);

// Ce middleware ne s'executera qui s'il reçoit une objet d'erreur en en tant que premier argument
// Donc si cela provient d'un next() il n'utilise pas le controller
// Si cela provient d'un next(error) il utilisera le controller
router.use(mainController.errorServer);

module.exports = router;