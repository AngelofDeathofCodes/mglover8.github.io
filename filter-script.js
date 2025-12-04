document.addEventListener('DOMContentLoaded', function() {
    // Get all filter elements
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const videoCards = document.querySelectorAll('.video-card');
    const clearButton = document.querySelector('.clear-filters');
    const filterBtn = document.querySelector('.filter-btn');
    const sidebar = document.querySelector('.sidebar');

    // Function to filter videos
    function filterVideos() {
        // Get all checked filters
        const checkedDifficulty = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(cb => cb.value);
        const checkedCategory = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
        const checkedDuration = Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => cb.value);

        // If no filters selected, show all videos
        if (checkedDifficulty.length === 0 && checkedCategory.length === 0 && checkedDuration.length === 0) {
            videoCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        // Filter each video card
        videoCards.forEach(card => {
            const videoDifficulty = card.dataset.difficulty;
            const videoCategories = card.dataset.category.split(' ');
            const videoDuration = card.dataset.duration;

            // Check if video matches filters
            const matchesDifficulty = checkedDifficulty.length === 0 || checkedDifficulty.includes(videoDifficulty);
            const matchesCategory = checkedCategory.length === 0 || checkedCategory.some(cat => videoCategories.includes(cat));
            const matchesDuration = checkedDuration.length === 0 || checkedDuration.includes(videoDuration);

            // Show video only if it matches ALL active filter categories
            if (matchesDifficulty && matchesCategory && matchesDuration) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Add event listeners to all checkboxes
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterVideos);
    });

    // Clear all filters
    clearButton.addEventListener('click', () => {
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        filterVideos();
    });

    // Mobile filter toggle
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            if (sidebar && !sidebar.contains(event.target) && filterBtn && !filterBtn.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        }
    });

    // VIDEO MODAL POPUP FUNCTIONALITY
    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <span class="video-modal-close">&times;</span>
            <div class="video-modal-body">
                <iframe src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="video-modal-info">
                <h3></h3>
                <p></p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalIframe = modal.querySelector('iframe');
    const modalClose = modal.querySelector('.video-modal-close');
    const modalTitle = modal.querySelector('.video-modal-info h3');
    const modalDescription = modal.querySelector('.video-modal-info p');

    // Add click event to each video card
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const iframe = this.querySelector('iframe');
            const videoSrc = iframe.src;
            const title = this.querySelector('.video-info h3').textContent;
            const description = this.querySelector('.video-info p').textContent;

            // Set modal content
            modalIframe.src = videoSrc + '?autoplay=1';
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking X
    modalClose.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        modalIframe.src = '';
        document.body.style.overflow = '';
    }
});