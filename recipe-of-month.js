// Recipe database - add all your recipes here
// IMPORTANT: Image filenames must match your actual image files in the project folder
const recipes = [
    {
        name: "Honey Sesame Chicken",
        description: "Try our easy honey sesame chicken - ready in just 30 minutes! A crispy, bite-size chicken dish coated in a sweet and savory honey-soy glaze, topped with toasted sesame seeds and green onions. It's flavorful, sticky, and often served over rice for a delicious Asian-inspired meal.",
        link: "honey-sesame-chicken.html",
        image: "sesame-chicken-1.jpg"  // ← This filename must match your actual image file
    },
    {
        name: "Butter Chicken",
        description: "Rich and creamy Indian curry with tender chicken pieces in a tomato-based sauce with aromatic spices. Perfect served over basmati rice with naan bread for dipping.",
        link: "butter-chicken.html",
        image: "Butter-Chicken.jpg"  // ← Must match actual filename (case-sensitive!)
    },
    {
        name: "Ground Beef Tacos",
        description: "Classic Mexican-style tacos with seasoned ground beef, fresh toppings, and warm tortillas. Quick, easy, and perfect for weeknight dinners or casual gatherings.",
        link: "ground-beef-tacos.html",
        image: "Ground-Beef-Tacos-TIMG.jpg"  // ← Must match actual filename
    },
    {
        name: "Beef Lasagna",
        description: "Layers of pasta, rich meat sauce, creamy béchamel, and melted cheese create this Italian comfort food classic. A crowd-pleasing dish that's worth the effort!",
        link: "lasagna.html",
        image: "Best-Lasagna_EXPS_ATBBZ25_36333_DR_07_01_2b.jpg"  // ← Must match actual filename
    },
    {
        name: "Beef Fried Rice",
        description: "Asian-inspired fried rice with tender beef, vegetables, and fluffy rice all tossed in a savory sauce. A great way to use leftover rice and create a complete meal.",
        link: "beef-fried-rice.html",
        image: "Beef-Fried-Rice-blog-2.jpg"  // ← Must match actual filename
    },
    {
        name: "Chicken Enchiladas",
        description: "Rolled tortillas filled with seasoned chicken, smothered in enchilada sauce and cheese. Baked until bubbly and golden for a delicious Mexican dinner.",
        link: "chicken-enchiladas.html",
        image: "chicken-enchiladas-1-12.jpg"  // ← Must match actual filename
    }
];

// Get the current year and month as a seed for consistency
function getMonthSeed() {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
}

// Seeded random number generator
// This ensures the same month always produces the same random number
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Select recipe based on current month
function selectRecipeOfTheMonth() {
    const seed = getMonthSeed();
    const randomIndex = Math.floor(seededRandom(seed) * recipes.length);
    return recipes[randomIndex];
}

// Update the DOM with the selected recipe
function displayRecipeOfTheMonth() {
    const recipe = selectRecipeOfTheMonth();
    
    // Find the HTML elements to update
    const titleElement = document.getElementById('secondary-hero-title');
    const descriptionElement = document.querySelector('.secondary-hero-text p strong');
    const buttonElement = document.querySelector('.secondary-hero-btn');
    const imageElement = document.querySelector('.secondary-hero-image img');
    
    // Update each element with the selected recipe data
    if (titleElement) {
        titleElement.textContent = `Recipe of the Month: ${recipe.name}`;
    }
    
    if (descriptionElement) {
        descriptionElement.innerHTML = recipe.description;
    }
    
    if (buttonElement) {
        buttonElement.href = recipe.link;
    }
    
    if (imageElement) {
        // This is where the image gets linked!
        imageElement.src = recipe.image;  // Sets the image source
        imageElement.alt = `${recipe.name} - Recipe of the Month`;  // Sets alt text
    }
    
    // Also update the background image of the secondary-hero section
    const secondaryHero = document.querySelector('.secondary-hero');
    if (secondaryHero) {
        secondaryHero.style.backgroundImage = `url(${recipe.image})`;
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', displayRecipeOfTheMonth);