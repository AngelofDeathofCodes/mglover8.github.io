// Navbar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarLogo = document.querySelector('.navbar-logo');
    
    // Only run on mobile/tablet screens
    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            // Check if mobile menu already exists
            if (!document.querySelector('.mobile-menu')) {
                // Create hamburger button
                const toggleButton = document.createElement('button');
                toggleButton.className = 'navbar-toggle';
                toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
                toggleButton.innerHTML = '<span></span><span></span><span></span>';
                navbarLogo.after(toggleButton);
                
                // Create mobile menu container
                const mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Get original menu items
                const originalMenu = document.querySelector('.navbar ul');
                const originalSearch = document.querySelector('.search');
                
                // Create menu items list
                const menuItems = document.createElement('ul');
                menuItems.className = 'menu-items';
                
                // Copy menu items
                if (originalMenu) {
                    const items = originalMenu.querySelectorAll('li');
                    items.forEach(item => {
                        const li = document.createElement('li');
                        const link = item.querySelector('a').cloneNode(true);
                        li.appendChild(link);
                        menuItems.appendChild(li);
                    });
                }
                
                // Create search section
                const searchSection = document.createElement('div');
                searchSection.className = 'mobile-search';
                
                // Add search input
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search...';
                searchSection.appendChild(searchInput);
                
                // Add search button
                const searchButton = document.createElement('button');
                searchButton.textContent = 'Go';
                searchButton.type = 'button';
                searchSection.appendChild(searchButton);
                
                // Add sign in button
                const signInBtn = document.createElement('a');
                signInBtn.href = 'signin.html';
                signInBtn.className = 'auth-btn';
                signInBtn.textContent = 'Sign In';
                searchSection.appendChild(signInBtn);
                
                // Assemble mobile menu
                mobileMenu.appendChild(menuItems);
                mobileMenu.appendChild(searchSection);
                
                // Add to page
                document.body.appendChild(mobileMenu);
                
                // Toggle functionality
                toggleButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    this.classList.toggle('active');
                    mobileMenu.classList.toggle('active');
                });
                
                // Close when clicking outside
                document.addEventListener('click', function(event) {
                    if (!navbar.contains(event.target) && !mobileMenu.contains(event.target)) {
                        toggleButton.classList.remove('active');
                        mobileMenu.classList.remove('active');
                    }
                });
                
                // Prevent menu close when clicking inside
                mobileMenu.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            }
        }
    }
    
    // Initialize on load
    initMobileMenu();
    
    // Re-initialize on resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Remove mobile menu on large screens
            if (window.innerWidth > 768) {
                const mobileMenu = document.querySelector('.mobile-menu');
                const toggleButton = document.querySelector('.navbar-toggle');
                if (mobileMenu) mobileMenu.remove();
                if (toggleButton) toggleButton.remove();
            } else {
                initMobileMenu();
            }
        }, 250);
    });
});