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

            const hook = fetch('https://hooks.zapier.com/hooks/catch/9500536/opmsmpg/',{
                method:'POST',
                body:formdata
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
            const reponse = await fetch(`${cardModule.card_base_url}/${currentCardId}`, {
                method: 'DELETE',

            })
            const hook = fetch('https://hooks.zapier.com/hooks/catch/9500536/opmsmpg/',{
                method:'POST',
                body:"suppression de carte"
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
            const hook = fetch('https://hooks.zapier.com/hooks/catch/9500536/opmsmpg/',{
                method:'POST',
                body:formData
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
        const hook = fetch('https://hooks.zapier.com/hooks/catch/9500536/opmsmpg/',{
                method:'POST',
                body:""
              })
    },



}
module.exports=cardModule