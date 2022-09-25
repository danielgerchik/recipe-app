document.addEventListener("DOMContentLoaded", function(event) {

    const mealsBlock = document.querySelector('.recipe__meals')
    const mealItem = document.querySelector('.recipe__meal')
    const mealImg = document.querySelector('.recipe__meal-img')
    const mealName = document.querySelector('.recipe__meal-name')
    const searchBtn = document.querySelector('.recipe__search-btn')
    
    const setRandomMeal = async e => {

        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        
        const randomMeal = await response.json()
        
        mealImg.setAttribute('src', randomMeal.meals[0].strMealThumb)
        mealName.innerHTML = randomMeal.meals[0].strMeal
        mealItem.classList.add('recipe__meal_random')
    }

    setRandomMeal()


    const setMealByName = async meal => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
        const meals = await response.json()
        const mealsArray = meals.meals
        mealsBlock.innerHTML = ''
        mealsArray.map(el => {
            mealsBlock.insertAdjacentHTML('beforeEnd', `                   
            <div class="recipe__meal">
                <img src="${el.strMealThumb}" class="recipe__meal-img"></img>
                <div class="recipe__meal-bottom">
                    <div class="recipe__meal-name">${el.strMeal}</div>
                    <div class="recipe__meal-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                    </div>
                </div>
            </div>
            `);
        
        })

    }

    searchBtn.addEventListener('click', e=> {
        
        const searchValue = document.querySelector('.recipe__search-field').value
        
        setMealByName(searchValue)

    })

  });