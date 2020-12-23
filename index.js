require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sanitizer = require('./app/middlewares/body-sanitizer');

const app = express();

const router = require('./app/router');

const port = process.env.PORT || 3000;

/*
Afin de rendre accessible notre API à d'autres domaines que le notre, 
on doit activer le middlware gérant le "Cross-Origin Ressource Sharing" (CORS) qui est bloqué par défaut sur les navigateurs.
Par défaut on ne pouvais récupérer des informations que par le biais d'un client autre qu'un navigateur ou a partir du domaine de l'API.
La vérification du domaine inclu également le port.
*/
app.use(cors('*'));
// Si on devait passer notre API en production et autorisé l'accès qu'a un seul domaine externe on pourrais utiliser le middlware de cette façon : 
// app.use(cors('https://www.domaine.com'));


app.use(express.urlencoded({extended: true}));

// ! Attention il faut que le middleware chargé d'assinir les données reçu ce trouve après le middleware chargé d'organiser les données reçu dans request.body
app.use(sanitizer);

app.use(router);

app.listen(port, _ => {
   console.log(`http://localhost:${port}`);
});