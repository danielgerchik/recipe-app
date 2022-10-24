document.addEventListener("DOMContentLoaded", function(event) {

    const recipeBlock = document.querySelector('.recipe')
    const mealsBlock = document.querySelector('.recipe__meals')
    const searchField = document.querySelector('.recipe__search-field')
    const searchBtn = document.querySelector('.recipe__search-btn')
    const manual = document.querySelector('.recipe__manual')
    const closeManualBtn = document.querySelector('.manual svg')
    const logo = document.querySelector('.recipe__logo')
    const favItems = document.querySelector('.recipe__favorites-items')
    const favBlock = document.querySelector('.recipe__favorites')
    const recipeContent = document.querySelector('.recipe__content')


    const getFromLS = () => {
      return JSON.parse(localStorage.getItem('recipeItem'))  
      }

     const addOrRemoveLS = async item => {

       let LSItems = await getFromLS()

       if(!LSItems) {
        LSItems = []
       }
      
     if(LSItems.some(el => el.idMeal === item.idMeal)) {
      const DeleteArray = LSItems.filter(el => el.idMeal != item.idMeal)
        localStorage.setItem('recipeItem', JSON.stringify(DeleteArray))
     } else {
        const newItemsArr = [...LSItems, item] 
        localStorage.setItem('recipeItem', JSON.stringify(newItemsArr))
     }

  }


  async function toggleIconClass (item, favBtn) {
    const storageItems = await getFromLS()
    if(storageItems) {
        storageItems.forEach(element => {
            if(element.idMeal === item.idMeal) {
                favBtn.classList.add('active')
            }
          })
    }
  }
    const setRandomMeal = async e => {

        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        
        const randomMeal = await response.json()
        
        mealsBlock.innerHTML = ''
        const mealEl = document.createElement('div')
        mealEl.classList.add('recipe__mealEl_random')
        mealEl.innerHTML = 
        `
        <div class="recipe__meal">
        <img src="${randomMeal.meals[0].strMealThumb}" class="recipe__meal-img"></img>
        <div class="recipe__meal-bottom">
            <div class="recipe__meal-name">${randomMeal.meals[0].strMeal}</div>
            <div class="recipe__meal-icon">
                <svg class="recipe__meal-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="recipe__meal-icon-path" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            </div>
        </div>
    </div>
        `
        mealsBlock.appendChild(mealEl)


        const favBtn =  mealsBlock.querySelector('.recipe__meal-icon')

        toggleIconClass (randomMeal.meals[0], favBtn)

       
        favBtn.addEventListener('click', async e=> {
            favBtn.classList.toggle('active')
           await addOrRemoveLS(randomMeal.meals[0])
            renderFavItems()
        })
        
        mealEl.addEventListener('click', e=> {
            if(!e.target.classList.contains('recipe__meal-icon-path') && !e.target.classList.contains('recipe__meal-icon-svg')) {
                showManual(randomMeal.meals[0])
            }
            
        })
    }

    logo.addEventListener('click', e=> {

        setRandomMeal()
    })

    setRandomMeal()


  async function renderFavItems() {
        const storageArr = await getFromLS()
        const allActiveFavBut = document.querySelectorAll('.recipe__meal-icon.active')
            favItems.innerHTML = ''
            storageArr.map(item => {
                const favItem = document.createElement('div')
                favItem.classList.add('recipe__favorites-item')
                favItem.innerHTML = 
                `
                <img  src="${item.strMealThumb}" class="recipe__favorites-img"></img>
                <div class="recipe__favorites-sub-text">
                    ${item.strMeal}
                </div>
                `
                favItem.addEventListener('click', e=> {
                    if(e.target.parentNode.nodeName !== 'svg' && e.target.nodeName !== 'svg') {
                        showManual(item)
                    }
                    
                })
                const favRemoveBut = document.createElement('div')
                favRemoveBut.classList.add('recipe__favorites-remove-but')
                favRemoveBut.innerHTML = 
                `<svg width="20" height="20" viewBox="0 0 455 455" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="227.5" cy="227.5" r="227.5" fill="white"/>
                <path d="M227.5 0C101.761 0 0 101.75 0 227.5C0 353.239 101.75 455 227.5 455C353.239 455 455 353.25 455 227.5C455.001 101.761 353.251 0 227.5 0ZM310.759 268.333C322.474 280.049 322.474 299.044 310.759 310.76C304.901 316.618 297.223 319.547 289.546 319.547C281.869 319.547 274.191 316.618 268.333 310.76L227.5 269.927L186.668 310.759C180.81 316.617 173.132 319.546 165.455 319.546C157.778 319.546 150.1 316.617 144.242 310.759C132.527 299.043 132.527 280.048 144.242 268.332L185.074 227.5L144.242 186.668C132.527 174.952 132.527 155.957 144.242 144.241C155.958 132.525 174.953 132.525 186.669 144.241L227.501 185.073L268.333 144.241C280.049 132.525 299.044 132.525 310.76 144.241C322.475 155.957 322.475 174.952 310.76 186.668L269.927 227.5L310.759 268.333Z" fill="#0C7A11"/>
                </svg>                
                ` 
                favRemoveBut.addEventListener('click', async ()=> {
                    await addOrRemoveLS(item)
                    renderFavItems()
                    allActiveFavBut.forEach(el=> {
                        if(item.strMealThumb === el.parentNode.parentNode.querySelector('.recipe__meal-img').getAttribute('src')) {
                            el.classList.remove('active')
                        }
                        
                        
                    })

                })
                favItem.appendChild(favRemoveBut)
                favItems.appendChild(favItem)
                
            })
            if(storageArr.length < 1) {
                favBlock.classList.add('none')
            } else {
                favBlock.classList.remove('none')
            }
            

    }
    renderFavItems()

    const setMealByName = async meal => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
        const meals = await response.json()
        const mealsArray = meals.meals
        mealsBlock.innerHTML = ''
        mealsArray.map(el => {
          const mealEl = document.createElement('div')
          mealEl.classList.add('recipe__mealEl')
          mealEl.innerHTML = `                   
          <div class="recipe__meal">
              <img src="${el.strMealThumb}" class="recipe__meal-img"></img>
              <div class="recipe__meal-bottom">
                  <div class="recipe__meal-name">${el.strMeal}</div>
                  <div class="recipe__meal-icon">
                      <svg class="recipe__meal-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="recipe__meal-icon-path" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                  </div>
              </div>
          </div>
          `
          
          const mealIcon = mealEl.querySelector('.recipe__meal-icon')

          toggleIconClass (el, mealIcon)


          mealIcon.addEventListener('click', async e=> {
            e.currentTarget.classList.toggle('active')
           await addOrRemoveLS(el)
            renderFavItems()
          })

          mealsBlock.appendChild(mealEl)



          mealEl.addEventListener('click', e=> {
            if(!e.target.classList.contains('recipe__meal-icon-path') && !e.target.classList.contains('recipe__meal-icon-svg')) {
                showManual(el)
            }
          })
        
        })


    }

    searchBtn.addEventListener('click', e=> {
        
        const searchValue = searchField.value
        if (searchValue) {
            setMealByName(searchValue)
        }

    })

    searchField.addEventListener('keypress', function(e) {
        if(e.key === 'Enter' && this.value) {
            setMealByName(this.value)
        }
    })

    
   function showManual(meal) {
    document.querySelector('.manual__name').innerHTML = meal.strMeal
    document.querySelector('.manual__instructions').innerHTML = meal.strInstructions
    document.querySelector('.manual__img').setAttribute('src', meal.strMealThumb)
    const ingrEl = document.querySelector('.manual__ingredients')

    

        const ingredients = []

        for (let i = 1; i <= 20; i++) {
            if(meal['strIngredient' + i]) {
                ingredients.push(`${meal['strIngredient' + i]} / ${meal['strMeasure' + i]}`)
            }
            
            
        }
       
    
        ingrEl.innerHTML = ''
        
       ingredients.forEach(ingr => {
        ingrEl.insertAdjacentHTML('beforeend', `<li>${ingr}</li>`)
       })

    

    manual.classList.remove('hidden')
    recipeContent.style.overflow = 'hidden'
    
   }
  
   closeManualBtn.addEventListener('click', e => {
    manual.classList.add('hidden')
    recipeContent.style.overflow = 'auto'
   })
  
   if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i
    .test(navigator.userAgent)) {

        recipeBlock.style.height = '-webkit-fill-available'

} 

  });

