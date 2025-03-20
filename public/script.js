let currentMood = '';

const moodButtons = document.querySelectorAll('.mood-btn');
const recipeContainer = document.getElementById('recipe-container');
const recipeName = document.getElementById('recipe-name');
const recipeIngredients = document.getElementById('recipe-ingredients');
const recipeInstructions = document.getElementById('recipe-instructions');

moodButtons.forEach(button => {
    button.classList.add('text-white', 'font-bold', 'py-3', 'px-4', 'rounded', 'transition', 'duration-200');
});

function setButtonsLoading(loading) {
    moodButtons.forEach(button => {
        button.disabled = loading;
        if (loading) {
            button.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
}

async function getRecipe(mood) {
    currentMood = mood;
    setButtonsLoading(true);
    
    try {
        recipeContainer.classList.remove('hidden');
        recipeName.textContent = 'Loading...';
        recipeIngredients.textContent = 'Please wait';
        recipeInstructions.textContent = 'Fetching your recipe';

        const response = await fetch(`/api/recipe/${mood}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch recipe');
        }

        recipeName.textContent = data.name;
        recipeIngredients.textContent = data.ingredients;
        recipeInstructions.textContent = data.instructions;
    } catch (error) {
        console.error('Error:', error);
        recipeName.textContent = 'Error';
        recipeIngredients.textContent = 'Something went wrong';
        recipeInstructions.textContent = error.message;
    } finally {
        setButtonsLoading(false);
    }
} 