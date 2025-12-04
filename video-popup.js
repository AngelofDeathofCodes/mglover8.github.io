// Video Popup Modal Functionality

// Create modal HTML structure and inject into page
function createModal() {
    const modalHTML = `
        <div id="videoModal" class="video-modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-video-container">
                    <iframe id="modalIframe" 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerpolicy="strict-origin-when-cross-origin" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="modal-info">
                    <h3 id="modalTitle"></h3>
                    <p id="modalDescription"></p>
                    <div id="modalMeta" class="video-meta"></div>
                    <div id="modalTags" class="video-tags"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .video-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .video-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90vh;
            width: 1000px;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from { 
                transform: translateY(50px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 25px;
            font-size: 35px;
            font-weight: bold;
            color: #666;
            cursor: pointer;
            transition: color 0.3s;
            z-index: 1;
        }
        
        .modal-close:hover,
        .modal-close:focus {
            color: #ff6b6b;
        }
        
        .modal-video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
            margin-bottom: 20px;
            border-radius: 8px;
            background: #000;
        }
        
        .modal-video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        
        .modal-info h3 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #333;
            font-size: 24px;
        }
        
        .modal-info p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 15px;
        }
        
        .modal-info .video-meta {
            margin-bottom: 15px;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                padding: 20px;
                max-height: 95vh;
            }
            
            .modal-close {
                font-size: 28px;
                top: 10px;
                right: 15px;
            }
            
            .modal-info h3 {
                font-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(styleSheet);
}

// Initialize modal
createModal();

const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalMeta = document.getElementById('modalMeta');
const modalTags = document.getElementById('modalTags');
const closeBtn = document.querySelector('.modal-close');

// Add click event to all video cards
document.querySelectorAll('.video-card').forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', function(e) {
        // Don't open modal if clicking on the iframe itself
        if (e.target.tagName === 'IFRAME') return;
        
        // Get video information
        const iframe = this.querySelector('iframe');
        const videoSrc = iframe.src;
        const title = this.querySelector('h3').textContent;
        const description = this.querySelector('.video-info > p').textContent;
        const metaInfo = this.querySelector('.video-meta').innerHTML;
        const tagsInfo = this.querySelector('.video-tags').innerHTML;
        
        // Set modal content
        modalIframe.src = videoSrc;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMeta.innerHTML = metaInfo;
        modalTags.innerHTML = tagsInfo;
        
        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
});

// Close modal when clicking the X button
closeBtn.addEventListener('click', closeModal);

// Close modal when clicking outside the content
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
    // Stop video playback by clearing the src
    modalIframe.src = '';
}