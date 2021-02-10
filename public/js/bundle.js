(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const listModule = require('./list');
const cardModule = require('./card');
const tagModule = require('./tag');

// on objet qui contient des fonctions
const app = {
  

  base_url:'https://dry-sands-45238.herokuapp.com/',
  defaultErrorMessage:'Oups,une erreur est survenue ',

  
  
  // fonction d'initialisation, lancée au chargement de la page
  init: async function () {
    listModule.setBaseUrl(app.base_url);
    cardModule.setBaseUrl(app.base_url);
    tagModule.setBaseUrl(app.base_url);
   
   
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
},{"./card":2,"./list":3,"./tag":4}],2:[function(require,module,exports){
const tagModule = require('./tag');
const cardModule = {

    defaultErrorMessage: 'Désolé un problème est survenu avec les cartes, veuillez réessayer ultérieurement',


    setBaseUrl: function (base_url) {
        cardModule.card_base_url = base_url + 'cards'
    },


    showAddCardModal: function (event) {
        const addCardModal = document.getElementById('addCardModal');
        addCardModal.classList.add('is-active');
        const currentList = event.target.closest('.panel');
        const listId = currentList.getAttribute('data-list_id');
        // Mise à jour de la valeur du champs list_id
        const listIdField = addCardModal.querySelector('[name="list_id"]');
        listIdField.value = listId;
    },

    makeCardInDOM: function (card) {
        //card CREATE

        const cardTemplate = document.getElementById('template-card');
        const cardTemplateContent = cardTemplate.content;

        const newCard = document.importNode(cardTemplateContent, true);
        const newCardContent = newCard.querySelector('.content');

        newCardContent.textContent = card.content;

        const newCardId = newCard.querySelector('[data-card_id]')
        newCardId.setAttribute('data-card_id', card.id)


        const newCardColor = newCard.querySelector('[style]')
        newCardColor.setAttribute('style', `background-color:${card.color}`)


        // card UPDATE
        const pencil = newCard.querySelector('.pencil')
        newCardContent.addEventListener('dblclick',cardModule.toggleCardForm)
        pencil.addEventListener('click', cardModule.toggleCardForm)

        const cardForm = newCard.querySelector('.box form')
        const contentField = cardForm.querySelector('textarea')

      
        
        
        contentField.value = card.content
        cardForm.addEventListener('submit', cardModule.handleCardForm)

        const addTagButton = newCard.querySelector('.add-tag-button')
        addTagButton.addEventListener('click', tagModule.showAddTagModal)




        // card DELETE
        const trashCard = newCard.querySelector('.trash-card')
        trashCard.addEventListener('click', cardModule.deleteCard)

        // find List to append the card 
        const listContainer = document.querySelector('[data-list_id="' + card.list_id + '"] .panel-block');

        listContainer.append(newCard);


    },

    toggleCardForm: function (e) {
        const currentcard = e.target.closest('[data-card_id]');
        const cardForm = currentcard.querySelector('.box form')
        cardForm.classList.toggle('is-hidden')
        const title = e.target.closest('.columns').querySelector('.content')
        title.classList.toggle('is-hidden')
    },



    handleCardForm: async function (e) {
        try {
            e.preventDefault()
            //recupere la valeur 
            const formdata = new FormData(e.target)

            //recupere le card Id
            const currentcard = e.target.closest('[data-card_id]')
            const cardId = currentcard.getAttribute('data-card_id')

            const updateCard = await fetch(`${cardModule.card_base_url}/${cardId}`, {
                method: 'PATCH',
                body: formdata
            })

            const card = await updateCard.json()

            const currentCardContent = currentcard.querySelector('.content')

            currentCardContent.textContent = card.content

            cardModule.toggleCardForm(e)
        } catch (error) {
            alert(cardModule.defaultErrorMessage)
        }


    },

    deleteCard: async function (e) {
        try {
            const currentCard = e.target.closest('[data-card_id]');
            const currentCardId = currentCard.getAttribute('data-card_id')
            const reponse = await fetch(`${cardModule.card_base_url}/cards/${currentCardId}`, {
                method: 'DELETE',

            })
            currentCard.remove()
        } catch (error) {
            alert(cardModule.defaultErrorMessage)
        }

    },
    handleAddCardForm: async function (event) {
        try {
            event.preventDefault();
            const lists = document.querySelectorAll('[data-list_id]')
            let cards = []

            for (const list of lists) {
                if (list.getAttribute('data-list_id') === event.target.list_id.value) {
                    cards = list.querySelectorAll('[data-card_id]')

                }

            }

            const formData = new FormData(event.target);
            formData.set('position', cards.length)

            const insertCard = await fetch(cardModule.card_base_url, {
                method: 'POST',
                body: formData,

            })

            const card = await insertCard.json()

            cardModule.makeCardInDOM(card);

        } catch (error) {
            console.log(error)
        }

    },



    handleDroppedCard: async function (e) {
        const prevList = e.from.closest('[data-list_id]')
        const newList = e.to.closest('[data-list_id]')

        const cards = prevList.querySelectorAll('[data-card_id]')
        const listId = prevList.getAttribute('data-list_id')
        cardModule.updateCardsFromList(cards, listId)

        if (newList !== prevList) {
            const cards = newList.querySelectorAll('[data-card_id]')
            const listId = newList.getAttribute('data-list_id')
            cardModule.updateCardsFromList(cards, listId)

        }

    },

    updateCardsFromList: async function (cards, listId) {
        cards.forEach((card, position) => {
            const cardId = card.getAttribute('data-card_id');
            let data = new FormData();
            data.set('position', position);
            data.set('list_id', listId);

            fetch(`${cardModule.card_base_url}/${cardId}`, {
                method: "PATCH",
                body: data
            });
        });
    },



}
module.exports=cardModule
},{"./tag":4}],3:[function(require,module,exports){
const cardModule=require('./card')
const tagModule = require('./tag');
const listModule ={

    defaultErrorMessage: 'Désolé un problème est survenu avec les listes, veuillez réessayer ultérieurement',

    setBaseUrl: function(base_url){
        listModule.list_base_url = base_url + 'lists'
    },

    getListsFromAPI:async function(){
        const response = await fetch(''+listModule.list_base_url);
        const lists = await response.json();
        
        for (const list of lists) {
            listModule.makeListInDOM(list.name,list.id)
            
            for (const card of list.cards) {
            cardModule.makeCardInDOM(card)
                
                
                for (const tag of card.tags) {
                const cardId=tag.card_has_tag.card_id
                tagModule.makeTaginDOM(tag,cardId)
                
                
            }
            
            }
        }
    },
        
    showAddListModal: function(){
        const addListModal = document.getElementById('addListModal');

        addListModal.classList.add('is-active');
    },   

        handleAddListForm: async function (event) {
       
        const lists=document.querySelectorAll('[data-list_id]')

        // On créé une instance de FormData nous facilitant la récupération des données du formulaire.
        const formData = new FormData(event.target);
        formData.set('position',lists.length)
        // On envoi le nom de la liste à la méthode chargé de la créer
        const postformdata = await fetch(listModule.list_base_url, {
            method: 'POST',
            body: formData,
        });

        const reponse = await postformdata.json()
       


        listModule.makeListInDOM(reponse.name,reponse.id,reponse.position)


    },

    makeListInDOM: function(listName,listId,){
    
        const listTemplate = document.getElementById('template-list');
    
        const listTemplateContent = listTemplate.content;
        
        const newList = document.importNode(listTemplateContent, true);
        
        const newListTitle = newList.querySelector('h2');
    
        newListTitle.textContent = listName;
        newListTitle.addEventListener('dblclick',listModule.showTitleForm)

        const currentList=newList.querySelector('[data-list_id]')
        currentList.dataset.list_id=listId
        currentList.setAttribute('name',listName)

        const setTitleForm=newList.querySelector('[data-list_id] form')
        setTitleForm.addEventListener('submit',listModule.handleTitleForm)
        
        const nameField = setTitleForm.querySelector('input[name="name"]')
        nameField.value=listName

        const idField = setTitleForm.querySelector('input[name="id"]');
        idField.value = listId;

        // Je récupère le conteneur de liste
        const listContainer = document.querySelector('.card-lists');

        // On oublie pas de rajouter l'écouteur de click sur le bouton +
        const button = newList.querySelector('.add-card-button');
        const trashList =newList.querySelector('.trash-list')
        trashList.addEventListener('click',function(e){
           if (currentList.querySelector('.box')) {
               if (confirm('Cette liste comporte des cartes, est tu sûr de vouloir la supprimer') === true) {
                   listModule.deleteList(e)
               } else {
                   return
               }
           } else {
               listModule.deleteList(e)
           }
        })
        // J'ajoute la liste à ce conteneur, afin qu'elle est une existance au sein du doument et que la liste soit visible
        // On l'ajoute en dernière position
        listContainer.append(newList);

        
        const createdList=document.querySelector(`[data-list_id="${listId}"] .panel-block`)
        

        new Sortable.create(createdList,{
            group:"card",
            draggable:".box",
            ghostClass: "sortable-ghostd", 
	        chosenClass: "sortable-chosend",
	        dragClass: "sortable-dragd",
            onEnd: cardModule.handleDroppedCard
      
        })


        button.addEventListener('click',cardModule.showAddCardModal);
    },

    showTitleForm:function(e){
        
        const currentList=e.target.closest('[data-list_id]')
        const title=e.target
        title.classList.toggle('is-hidden')
        const titleForm=currentList.querySelector('.panel-heading form')
        titleForm.classList.toggle('is-hidden')
    
    },
    handleTitleForm: async function(e){
        try {
            e.preventDefault()
    
            const currentList = e.target.closest('[data-list_id]')
            const listId = currentList.getAttribute('data-list_id')
            const formdata = new FormData(e.target)
    
            const updateTitle = await fetch(`${listModule.list_base_url}/${listId}`, {
                method: 'PATCH',
                body: formdata,
    
        })
        const dataList=await updateTitle.json()
        
        if(updateTitle.status !== 200){
            throw error;
        }
    
        const currentListTitle = currentList.querySelector('h2')
    
        currentListTitle.textContent = dataList.name
        
        const status = await updateTitle.status
        console.log(status)
    
        const titleForm=currentList.querySelector('.panel-heading form')
        const title=currentList.querySelector('h2')
        title.classList.toggle('is-hidden')
        titleForm.classList.toggle('is-hidden')
        
        } catch (error) {
        alert(listModule.defaultErrorMessage)
        console.log('error')
    
        }
  
    
    },

    deleteList:async function (e) {
        try {
        const currentList=e.target.closest('[data-list_id]');
        const currentListId=currentList.getAttribute('data-list_id')
        const reponse = await fetch(`${listModule.list_base_url}/${currentListId}`,{
        method:'DELETE',
    
        })
        currentList.remove()
        } catch (error) {
        alert(listModule.defaultErrorMessage)
        }
    },

   
    updateListPosition:async function(){
        
      
        const lists=document.querySelectorAll('[data-list_id]')
        let index=0
        for (const list of lists) {
           const listId= list.getAttribute('data-list_id')
           const listName=list.getAttribute('name')
           
           const data=new FormData()
           data.set("name",listName)
           data.set("position",index++)

           const reponse =await fetch(`${listModule.list_base_url}/${listId}`,{
                method:'PATCH',
                body:data
             
            })
        }



    }
}
module.exports=listModule

},{"./card":2,"./tag":4}],4:[function(require,module,exports){
const tagModule={
  setBaseUrl: function (base_url) {
    tagModule.tag_base_url = base_url + 'tags'
    tagModule.base_url=base_url
      },
    getTagsFromAPI:async function(){
        const reponse= await fetch(tagModule.tag_base_url)
        const tags=await reponse.json()
    
    
        const addTagModal=document.getElementById('addTagModal')
        const addTagForm = addTagModal.querySelector('.modal-card-body')
    
            
        for (const tag of tags) {
              const newtag=document.createElement('div')
              newtag.className='tag'
              newtag.setAttribute("tag-id",tag.id)
              newtag.style.backgroundColor=tag.color
              newtag.textContent=tag.name
             addTagForm.append(newtag)
             }
        
      },

    showAddTagModal: async function(e){
    
        const addTagModal=document.getElementById('addTagModal')
        const addTagForm = addTagModal.querySelector('.modal-card-body');
    
    
        addTagModal.classList.add('is-active');
        const currentcard=e.target.closest('[data-card_id]')
        const cardId=currentcard.getAttribute('data-card_id')
        const cardIdField = addTagModal.querySelector('input[name="card_id"]')
        
        cardIdField.value=cardId
      },
    
      handleAddTagForm: async function(e){
        try {
         
          const tagId=e.target.getAttribute('tag-id')
          const currentform=e.target.closest('form')
          const tagIdField=currentform.querySelector('input[name=tag_id]')
          tagIdField.value=tagId
         
          const cardId = currentform.querySelector('input[name="card_id"]').value
    
          
         
          const formdata=new FormData(currentform)
          const addTag= await fetch(`${tagModule.base_url}cards/${cardId}/tags`,{
            method:'POST',
            body:formdata
          })
    
          // ajoute le tag dans la carte
          const currentTag=e.target
          const tagclone=currentTag.cloneNode(true)
          tagclone.addEventListener('click',tagModule.deleteTag)
          const currentCard=document.querySelector(`[data-card_id="${cardId}"]`)
          const existtag=currentCard.querySelector(`[tag-id="${tagId}"]`)
          if(!existtag){
            
            currentCard.insertBefore(tagclone,currentCard.querySelector('.add-tag-button'))
          }
    
        } catch (error) {
         console.log(error)
        }
      },

      makeTaginDOM:function(tag,cardId){
     
        const newtag=document.createElement('div')
        newtag.className='tag'
        newtag.style.backgroundColor=tag.color
        newtag.style.cursor="pointer"
        newtag.textContent=tag.name
        newtag.setAttribute('tag-id',tag.id)
        newtag.addEventListener('click',tagModule.deleteTag)
        const cardContainer=document.querySelector(`[data-card_id="${cardId}"]`)
        const plusButton=cardContainer.querySelector('.add-tag-button')
        cardContainer.insertBefore(newtag,plusButton)
        
     
        
      },
      deleteTag:async function(e){
        const currentCard=e.target.closest('[data-card_id]')
        const cardId=currentCard.getAttribute('data-card_id')
        const tagId=e.target.getAttribute('tag-id')
        
        await fetch(`${tagModule.base_url}cards/${cardId}/tags/${tagId}`,{
          method:'DELETE'
        })

        e.target.remove()


      }
}
module.exports=tagModule
},{}]},{},[1]);
