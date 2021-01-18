const listModule = require('./list');
const cardModule = require('./card');
const tagModule = require('./tag');

// on objet qui contient des fonctions
const app = {
  

  base_url:'http://localhost:3000/',
  defaultErrorMessage:'Oups,une erreur est survenue ',

  
  
  // fonction d'initialisation, lancée au chargement de la page
  init: async function () {
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
   
    console.log('app.init !');
    
    listModule.getListsFromAPI();
    await tagModule.getTagsFromAPI()
    app.addListenerToActions();
    const listcontainer=document.getElementById('mainContainer')
    //listcontainer.addEventListener('drop',listModule.updateListPosition)

    new Sortable.create(listcontainer,{
      group: "list",
     draggable: ".panel",
      onEnd: listModule.updateListPosition
   
    
    })
  },

  addListenerToActions: function (){
    // On récupère le bouton de créeationde liste grâce à son attribut "id"
    const addListButton = document.getElementById('addListButton');
    // On branche un écouteur d'évenement, afin de capturer le click de l'utilisateur sur ce bouton
    addListButton.addEventListener('click', listModule.showAddListModal);

    // Ici on récupère plusieurs objet grâce à leur classe
    const closeModalButtons = document.querySelectorAll('.close');
    // Donc il faut ensuite bouclé sur ces différents objet afin de leur ajouter un écouteur d'événement.
    for(const button of closeModalButtons){
      button.addEventListener('click', app.hideModals);
    }

    // On intercepte la soummision du formulaire d'ajout de liste
    const addListForm = document.querySelector('#addListModal form');
    addListForm.addEventListener('submit', async function(e){
      e.preventDefault()
     await listModule.handleAddListForm(e) 
     app.hideModals()
    });

    // On ecoute le bouton +
    const addCardButtons = document.querySelectorAll('.add-card-button');
    for(const button of addCardButtons){
      button.addEventListener('click', cardModule.showAddCardModal);
    }

    // On intercepte la soummision du formulaire d'ajout de carte
    const addCardForm = document.querySelector('#addCardModal form');
    addCardForm.addEventListener('submit', async function(e){
      e.preventDefault()
      await cardModule.handleAddCardForm(e)
      app.hideModals()
    });


    // On intercepte la soummision du formulaire d'ajout d'un tag '

    const addTagForm = document.querySelector('#addTagModal form')
    const addTagButtons = addTagForm.querySelectorAll('.tag')
   
    for (const button of addTagButtons) {
      button.style.cursor="pointer"
      button.addEventListener('click',async function(e){
        tagModule.handleAddTagForm(e)
        app.hideModals()
      })
      
    }
    

  },

  hideModals: function(){
    const modals = document.querySelectorAll('.modal');
    for(const modal of modals){
      modal.classList.remove('is-active');
    }
  },

};
module.exports=app


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );