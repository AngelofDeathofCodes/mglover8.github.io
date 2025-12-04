// ...existing code...
// Recipe database - add all your recipes here
const recipes = [
    {
        name: "Honey Sesame Chicken",
        description: "Try our easy honey sesame chicken - ready in just 30 minutes! A crispy, bite-size chicken dish coated in a sweet and savory honey-soy glaze, topped with toasted sesame seeds and green onions. It's flavorful, sticky, and often served over rice for a delicious Asian-inspired meal.",
        link: "honey-sesame-chicken.html",
        image: "sesame-chicken-1.jpg"
    },
    {
        name: "Butter Chicken",
        description: "Rich and creamy Indian curry with tender chicken pieces in a tomato-based sauce with aromatic spices. Perfect served over basmati rice with naan bread for dipping.",
        link: "butter-chicken.html",
        image: "Butter-Chicken.jpg"
    },
    {
        name: "Ground Beef Tacos",
        description: "Classic Mexican-style tacos with seasoned ground beef, fresh toppings, and warm tortillas. Quick, easy, and perfect for weeknight dinners or casual gatherings.",
        link: "ground-beef-tacos.html",
        image: "Ground-Beef-Tacos-TIMG.jpg"
    },
    {
        name: "Beef Lasagna",
        description: "Layers of pasta, rich meat sauce, creamy béchamel, and melted cheese create this Italian comfort food classic. A crowd-pleasing dish that's worth the effort!",
        link: "lasagna.html",
        image: "Best-Lasagna_EXPS_ATBBZ25_36333_DR_07_01_2b.jpg"
    },
    {
        name: "Beef Fried Rice",
        description: "Asian-inspired fried rice with tender beef, vegetables, and fluffy rice all tossed in a savory sauce. A great way to use leftover rice and create a complete meal.",
        link: "beef-fried-rice.html",
        image: "Beef-Fried-Rice-blog-2.jpg"
    },
    {
        name: "Chicken Enchiladas",
        description: "Rolled tortillas filled with seasoned chicken, smothered in enchilada sauce and cheese. Baked until bubbly and golden for a delicious Mexican dinner.",
        link: "chicken-enchiladas.html",
        image: "chicken-enchiladas-1-12.jpg"
    }
];

// Get the current year and month as a seed for consistency
function getMonthSeed() {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
}

// Seeded random number generator (deterministic per month)
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

// helper: if image path is not absolute, prefer ./images/ folder
function resolveImagePath(filename) {
    if (!filename) return '';
    if (filename.startsWith('http://') || filename.startsWith('https://') || filename.startsWith('/') || filename.startsWith('./') ) {
        return filename;
    }
    return `./images/${filename}`;
}

// Build and show description popup/modal
function showRecipePopup(recipe) {
    // remove existing popup if any
    const existing = document.getElementById('rot-popup-overlay');
    if (existing) existing.remove();

    // basic styles inserted once
    if (!document.getElementById('rot-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'rot-popup-styles';
        style.textContent = `
#rot-popup-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999}
#rot-popup{background:#fff;color:#111;max-width:920px;width:calc(100% - 32px);border-radius:10px;overflow:hidden;box-shadow:0 10px 50px rgba(0,0,0,.35);animation:rotFade .18s ease}
#rot-popup .rot-inner{display:flex;flex-direction:row;gap:18px;padding:18px}
#rot-popup img{width:42%;max-width:360px;height:auto;object-fit:cover;border-radius:6px}
#rot-popup .rot-body{flex:1;display:flex;flex-direction:column;gap:8px}
#rot-popup h2{margin:0;font-size:1.25rem}
#rot-popup p{margin:0;color:#444;line-height:1.45}
#rot-popup .rot-actions{margin-top:8px;display:flex;gap:8px;align-items:center}
#rot-popup .rot-btn{padding:8px 12px;background:#eb8b3d;color:#000;border:none;border-radius:6px;text-decoration:none;font-weight:600}
#rot-popup .rot-close{background:transparent;border:none;color:#666;cursor:pointer;font-size:16px;padding:6px}
@keyframes rotFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media(max-width:720px){#rot-popup .rot-inner{flex-direction:column}#rot-popup img{width:100%;max-width:100%}}
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.id = 'rot-popup-overlay';
    overlay.innerHTML = `
        <div id="rot-popup" role="dialog" aria-modal="true" aria-label="Recipe of the Month: ${escapeHtml(recipe.name)}">
            <div class="rot-inner">
                <img src="${escapeHtml(resolveImagePath(recipe.image))}" alt="${escapeHtml(recipe.name)}">
                <div class="rot-body">
                    <div style="display:flex;justify-content:space-between;align-items:start">
                        <h2>${escapeHtml(recipe.name)}</h2>
                        <button class="rot-close" aria-label="Close description">&times;</button>
                    </div>
                    <p id="rot-desc">${escapeHtml(recipe.description)}</p>
                    <div class="rot-actions">
                        <a class="rot-btn" href="${escapeHtml(recipe.link)}">View Recipe</a>
                        <button class="rot-close rot-btn" style="background:#ddd;color:#111">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // close handlers
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
    overlay.querySelectorAll('.rot-close').forEach(btn => btn.addEventListener('click', ()=> overlay.remove()));
    // close on Escape
    function escHandler(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', escHandler); } }
    document.addEventListener('keydown', escHandler);
}

// helper to safely set text content (used inside popup above)
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

// Update the DOM with the selected recipe and ensure description displays correctly
function displayRecipeOfTheMonth() {
    const recipe = selectRecipeOfTheMonth();

    // primary targets (secondary hero pattern)
    const titleElement = document.getElementById('secondary-hero-title');
    const descTextSelectorCandidates = [
        '.secondary-hero-text p strong',
        '.secondary-hero-text p',
        '.secondary-hero-text .description',
        '#recipe-of-month .rot-description'
    ];
    let descriptionElement = null;
    for (const sel of descTextSelectorCandidates) {
        const el = document.querySelector(sel);
        if (el) { descriptionElement = el; break; }
    }
    const buttonElement = document.querySelector('.secondary-hero-btn');
    const imageElement = document.querySelector('.secondary-hero-image img');

    // Update each element with the selected recipe data (safe updates)
    if (titleElement) {
        titleElement.textContent = `Recipe of the Month: ${recipe.name}`;
    }

    if (descriptionElement) {
        // set textContent so HTML is not injected; keep simple readable description
        descriptionElement.textContent = recipe.description;
    } else {
        // if no description target found, create a small card in #recipe-of-month if present
        const container = document.getElementById('recipe-of-month');
        if (container) {
            container.innerHTML = `
                <article class="rot-card" style="max-width:1100px;margin:18px auto;padding:16px;background:#fff;border-radius:8px;display:flex;gap:16px;align-items:flex-start;box-shadow:0 8px 24px rgba(0,0,0,.08)">
                    <img src="${escapeHtml(resolveImagePath(recipe.image))}" alt="${escapeHtml(recipe.name)}" style="width:260px;height:auto;object-fit:cover;border-radius:6px">
                    <div>
                        <h3 style="margin:0 0 8px 0">${escapeHtml(recipe.name)}</h3>
                        <p style="margin:0 0 12px 0;color:#444">${escapeHtml(recipe.description)}</p>
                        <a href="${escapeHtml(recipe.link)}" class="rot-btn" style="padding:8px 12px;background:#eb8b3d;color:#000;border-radius:6px;text-decoration:none;font-weight:600">View Recipe</a>
                    </div>
                </article>
            `;
        }
    }

    if (buttonElement) {
        buttonElement.href = recipe.link;
        // ensure button text indicates recipe
        if (!buttonElement.textContent.trim()) buttonElement.textContent = 'View Recipe';
    }

    if (imageElement) {
        imageElement.src = resolveImagePath(recipe.image);
        imageElement.alt = `${recipe.name} - Recipe of the Month`;
    }

    // Update background of secondary hero if present (use resolved path)
    const secondaryHero = document.querySelector('.secondary-hero');
    if (secondaryHero) {
        const imgPath = resolveImagePath(recipe.image);
        secondaryHero.style.backgroundImage = `url(${imgPath})`;
        secondaryHero.style.backgroundSize = 'cover';
        secondaryHero.style.backgroundPosition = 'center';
    }

    // Show popup with the right description so user sees it immediately
    // Only show popup on index page (we target by presence of section id/class)
    const onIndex = !!document.getElementById('recipe-of-month') || !!document.querySelector('.secondary-hero');
    if (onIndex) {
        // Delay slightly so page content settles
        setTimeout(()=> showRecipePopup(recipe), 400);
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', displayRecipeOfTheMonth);
// ...existing, displayRecipeOfTheMonth);
