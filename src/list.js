const cardModule=require('./card')

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
        const reponse = await fetch(listModule.list_base_url`/${currentListId}`,{
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
