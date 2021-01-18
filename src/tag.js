tagModule={

    getTagsFromAPI:async function(){
        const reponse= await fetch('http://localhost:3000/tags')
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
          const addTag= await fetch(`http://localhost:3000/cards/${cardId}/tags`,{
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
        
        await fetch(`http://localhost:3000/cards/${cardId}/tags/${tagId}`,{
          method:'DELETE'
        })

        e.target.remove()


      }
}
module.exports=tagModule