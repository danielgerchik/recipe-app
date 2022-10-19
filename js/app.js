document.addEventListener("DOMContentLoaded", function(event) {

    const mealsBlock = document.querySelector('.recipe__meals')
    const searchField = document.querySelector('.recipe__search-field')
    const searchBtn = document.querySelector('.recipe__search-btn')
    const manual = document.querySelector('.recipe__manual')
    const closeManualBtn = document.querySelector('.manual svg')
    const logo = document.querySelector('.recipe__logo')

    const getFromLS = () => {
      return JSON.parse(localStorage.getItem('recipeItem'))  
      }

     const addToLS = item => {

       let LSItems = getFromLS()

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="recipe__meal-icon-path" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            </div>
        </div>
    </div>
        `
        mealsBlock.appendChild(mealEl)


        const favBtn =  mealsBlock.querySelector('.recipe__meal-icon')
       
        favBtn.addEventListener('click', e=> {
            favBtn.classList.toggle('active')
            addToLS(randomMeal.meals[0])
        })
        
        mealEl.addEventListener('click', e=> {
            if(!e.target.classList.contains('recipe__meal-icon-path')) {
                showManual(randomMeal.meals[0])
            }
            
        })
    }

    logo.addEventListener('click', e=> {

        setRandomMeal()
    })

    setRandomMeal()


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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path class="recipe__meal-icon-path" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                  </div>
              </div>
          </div>
          `
          
          mealEl.querySelector('.recipe__meal-icon').addEventListener('click', e=> {
            e.currentTarget.classList.toggle('active')
            addToLS(el)
          })
          
        //   elem.classList.toggle('active')
        //   addToLS(el)

          mealsBlock.appendChild(mealEl)



          mealEl.addEventListener('click', e=> {
            if(!e.target.classList.contains('recipe__meal-icon-path')) {
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

    
   const showManual = meal => {
    document.querySelector('.manual__name').innerHTML = meal.strMeal
    document.querySelector('.manual__instructions').innerHTML = meal.strInstructions
    document.querySelector('.manual__img').setAttribute('src', meal.strMealThumb)
    
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
        if(meal['strIngredient' + i]) {
            ingredients.push(`${meal['strIngredient' + i]} / ${meal['strMeasure' + i]}`)
        }
        
        
    }
   const ingrEl = document.querySelector('.manual__ingredients')
   
   ingredients.forEach(ingr => {
    ingrEl.insertAdjacentHTML('beforeend', `<li>${ingr}</li>`)
   })

    manual.classList.remove('hidden')
   }
  
   closeManualBtn.addEventListener('click', e => {
    manual.classList.add('hidden')
   })
   
  });