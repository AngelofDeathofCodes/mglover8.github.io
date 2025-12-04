let recipeRatingsCache = {};

/**
 * Toggle mobile sidebar visibility
 */
function toggleSidebar() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('active');
}

/**
 * Clear all filter selections
 */
function clearFilters() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    filterRecipes();
}

/**
 * Helper function to get recipe ID from card
 * @param {HTMLElement} card - The recipe card element
 * @returns {string|null} - The recipe ID
 */
function getRecipeIdFromCard(card) {
    // First try data-recipe-id attribute
    if (card.dataset.recipeId) {
        return card.dataset.recipeId;
    }
    
    // Fallback: extract from link href
    const link = card.querySelector('a');
    if (!link) return null;
    
    const href = link.getAttribute('href');
    return href.replace('.html', '').toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get rating data for a specific recipe from storage
 * @param {string} recipeId - The recipe ID
 * @returns {Promise<Object>} - Rating data object
 */
async function getRatingForRecipe(recipeId) {
    // Check cache first
    if (recipeRatingsCache[recipeId]) {
        return recipeRatingsCache[recipeId];
    }

    // Check if window.storage exists
    if (!window.storage) {
        return { average: 0, total: 0, ratings: [] };
    }

    try {
        const result = await window.storage.get(`recipe-ratings:${recipeId}`);
        if (result && result.value) {
            const data = JSON.parse(result.value);
            recipeRatingsCache[recipeId] = data;
            return data;
        }
    } catch (error) {
        console.log(`No rating found for ${recipeId}`);
    }
    
    return { average: 0, total: 0, ratings: [] };
}

/**
 * Main filtering function - filters recipes based on selected criteria
 */
async function filterRecipes() {
    const selectedMeals = getSelectedValues('meal');
    const selectedCuisines = getSelectedValues('cuisine');
    const selectedDifficulties = getSelectedValues('difficulty');
    const selectedDietary = getSelectedValues('dietary');
    const selectedTimes = getSelectedValues('time');
    const selectedRatings = getSelectedValues('rating');

    const recipeCards = document.querySelectorAll('.recipe-card');

    for (const card of recipeCards) {
        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        const metaText = card.querySelector('.recipe-meta').textContent.toLowerCase();
        
        let showRecipe = true;

        // Filter by meal type
        if (selectedMeals.length > 0) {
            const matchesMeal = selectedMeals.some(meal => tags.includes(meal));
            if (!matchesMeal) showRecipe = false;
        }

        // Filter by cuisine
        if (selectedCuisines.length > 0) {
            const matchesCuisine = selectedCuisines.some(cuisine => tags.includes(cuisine));
            if (!matchesCuisine) showRecipe = false;
        }

        // Filter by difficulty
        if (selectedDifficulties.length > 0) {
            const matchesDifficulty = selectedDifficulties.some(diff => metaText.includes(diff));
            if (!matchesDifficulty) showRecipe = false;
        }

        // Filter by dietary
        if (selectedDietary.length > 0) {
            const matchesDietary = selectedDietary.some(diet => tags.includes(diet));
            if (!matchesDietary) showRecipe = false;
        }

        // Filter by cooking time
        if (selectedTimes.length > 0) {
            const timeMatch = selectedTimes.some(timeRange => {
                const timeText = card.querySelector('.recipe-meta').textContent;
                const minutes = parseInt(timeText.match(/(\d+)\s*min/)?.[1] || '0');
                
                if (timeRange === 'under30' && minutes < 30) return true;
                if (timeRange === '30to60' && minutes >= 30 && minutes <= 60) return true;
                if (timeRange === 'over60' && minutes > 60) return true;
                return false;
            });
            if (!timeMatch) showRecipe = false;
        }

        // Filter by rating
        if (selectedRatings.length > 0 && showRecipe) {
            const recipeId = getRecipeIdFromCard(card);
            if (recipeId) {
                const ratingData = await getRatingForRecipe(recipeId);
                
                const meetsRating = selectedRatings.some(minRating => {
                    const minRatingNum = parseInt(minRating);
                    return ratingData.average >= minRatingNum;
                });
                
                if (!meetsRating) showRecipe = false;
            }
        }

        // Show or hide the recipe card
        card.style.display = showRecipe ? 'block' : 'none';
    }

    // Update results count
    const visibleRecipes = document.querySelectorAll('.recipe-card[style="display: block;"], .recipe-card:not([style*="display: none"])').length;
    updateResultsCount(visibleRecipes);
}

/**
 * Helper function to get selected checkbox values
 * @param {string} name - The name attribute of checkboxes
 * @returns {Array<string>} - Array of selected values
 */
function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Update the results count display
 * @param {number} count - Number of visible recipes
 */
function updateResultsCount(count) {
    const header = document.querySelector('.filter-header h2');
    const totalRecipes = document.querySelectorAll('.recipe-card').length;
    
    if (count === totalRecipes) {
        header.textContent = `Recipes (${totalRecipes})`;
    } else {
        header.textContent = `Recipes (${count} of ${totalRecipes})`;
    }
}

/**
 * Load and display ratings for all recipes from storage
 */
async function loadRecipeRatings() {
    // Check if window.storage exists
    if (!window.storage) {
        console.log('Storage API not available');
        return;
    }

    const recipeCards = document.querySelectorAll('.recipe-card');
    
    for (const card of recipeCards) {
        const recipeId = getRecipeIdFromCard(card);
        if (!recipeId) continue;
        
        try {
            const data = await getRatingForRecipe(recipeId);
            
            if (data.total > 0) {
                // Update the rating display in the card
                const ratingDisplay = card.querySelector('.rating-display');
                if (ratingDisplay) {
                    ratingDisplay.textContent = `⭐ ${data.average.toFixed(1)} (${data.total})`;
                }
            }
        } catch (error) {
            console.log(`Error loading rating for ${recipeId}:`, error);
        }
    }
}

/**
 * Apply filters based on URL parameters
 */
function applyURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check each filter type and apply if present
    const filterTypes = ['meal', 'cuisine', 'difficulty', 'dietary', 'time', 'rating'];
    
    filterTypes.forEach(filterType => {
        const value = urlParams.get(filterType);
        if (value) {
            const checkbox = document.getElementById(value);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });
    
    // Apply filters if any were set
    if (urlParams.toString()) {
        filterRecipes();
    }
}

/**
 * Initialize the page when DOM is loaded
 */
function initializePage() {
    // Add event listeners to all filter checkboxes
    document.querySelectorAll('.filter-option input').forEach(checkbox => {
        checkbox.addEventListener('change', filterRecipes);
    });

    // Apply URL filters if present
    applyURLFilters();

    // Load recipe ratings from storage
    loadRecipeRatings();

    // Initialize the recipe count
    const totalRecipes = document.querySelectorAll('.recipe-card').length;
    updateResultsCount(totalRecipes);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    // DOM is already loaded
    initializePage();
}