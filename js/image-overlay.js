/**
 * Image Overlay JavaScript for Abhijeet's Portfolio
 * Handles the popup display of logo and profile images
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("[ImageOverlay] Initializing image overlay functionality");
    // Allow a small delay to ensure other scripts have initialized
    setTimeout(initImageOverlay, 200);
});

/**
 * Initialize image overlay functionality
 */
function initImageOverlay() {
    // Elements to make clickable - using more robust selectors
    const sidebarLogo = document.getElementById('sidebar-logo');
    const profilePic = document.querySelector('.profile-image-container img')|| 
                       document.querySelector('.profile-pic')
    
    // Overlay elements
    const imageOverlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');
    const closeOverlay = document.querySelector('.close-overlay');
    
    // Check if elements exist
    if (!imageOverlay || !overlayImage || !closeOverlay) {
        console.error("[ImageOverlay] Required overlay elements not found");
        return;
    }
    
    // Log found elements for debugging
    console.log("[ImageOverlay] Elements found:", {
        sidebarLogo: !!sidebarLogo,
        profilePic: !!profilePic,
        imageOverlay: !!imageOverlay,
        overlayImage: !!overlayImage,
        closeOverlay: !!closeOverlay
    });
    
    // Handle sidebar logo
    if (sidebarLogo) {
        sidebarLogo.parentElement.classList.add('clickable-image');
        sidebarLogo.style.cursor = 'pointer';
        
        // Use mousedown instead of click for better responsiveness
        sidebarLogo.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling
            const imgSrc = this.src;
            console.log("[ImageOverlay] Logo clicked, src:", imgSrc);
            openImageOverlay(imgSrc, 'Abhijeet Logo');
        });
        
        // Touch support for mobile
        sidebarLogo.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const imgSrc = this.src;
            console.log("[ImageOverlay] Logo touched, src:", imgSrc);
            openImageOverlay(imgSrc, 'Abhijeet Logo');
        }, {passive: false});
    } else {
        console.warn("[ImageOverlay] Sidebar logo not found with ID 'sidebar-logo'");
        
        // Try alternative selector for logo
        const altLogo = document.querySelector('.profile-pic-container img');
        if (altLogo) {
            console.log("[ImageOverlay] Found logo with alternative selector");
            altLogo.parentElement.classList.add('clickable-image');
            altLogo.style.cursor = 'pointer';
            
            altLogo.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openImageOverlay(this.src, 'Abhijeet Logo');
            });
            
            altLogo.addEventListener('touchstart', function(e) {
                e.preventDefault();
                openImageOverlay(this.src, 'Abhijeet Logo');
            }, {passive: false});
        }
    }
    
    // Handle profile image
    if (profilePic) {
        profilePic.parentElement.classList.add('clickable-image');
        profilePic.style.cursor = 'pointer';
        
        profilePic.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imgSrc = this.src;
            console.log("[ImageOverlay] Profile pic clicked, src:", imgSrc);
            openImageOverlay(imgSrc, 'Abhijeet Profile');
        });
        
        profilePic.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const imgSrc = this.src;
            console.log("[ImageOverlay] Profile pic touched, src:", imgSrc);
            openImageOverlay(imgSrc, 'Abhijeet Profile');
        }, {passive: false});
    } else {
        console.warn("[ImageOverlay] Profile pic not found with selector '.profile-image-container img'");
        
        // Try alternative selector for profile pic
        const altProfilePic = document.querySelector('.profile-pic');
        if (altProfilePic) {
            console.log("[ImageOverlay] Found profile pic with alternative selector");
            altProfilePic.parentElement.classList.add('clickable-image');
            altProfilePic.style.cursor = 'pointer';
            
            altProfilePic.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openImageOverlay(this.src, 'Abhijeet Profile');
            });
            
            altProfilePic.addEventListener('touchstart', function(e) {
                e.preventDefault();
                openImageOverlay(this.src, 'Abhijeet Profile');
            }, {passive: false});
        }
    }
    
    // Close overlay handlers
    closeOverlay.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeImageOverlay();
        console.log('[ImageOverlay] Overlay closed via close button');
    });
    
    imageOverlay.addEventListener('mousedown', function(e) {
        if (e.target === imageOverlay) {
            closeImageOverlay();
            console.log('[ImageOverlay] Overlay closed via background click');
        }
    });
    
    // Close overlay on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageOverlay.classList.contains('active')) {
            closeImageOverlay();
            console.log('[ImageOverlay] Overlay closed via Escape key');
        }
    });
    
    // Track performance for rendering
    overlayImage.addEventListener('load', function() {
        overlayImage.classList.add('loaded');
        console.log(`[ImageOverlay] Image loaded successfully`);
    });
    
    /**
     * Open the image overlay with the specified image
     * @param {string} imageSrc - Source URL of the image
     * @param {string} altText - Alt text for the image
     */
    function openImageOverlay(imageSrc, altText) {
        console.log('[ImageOverlay] Opening overlay with image:', imageSrc);
        
        // Ensure image src is not empty
        if (!imageSrc || imageSrc === '') {
            console.error('[ImageOverlay] Cannot open overlay - image source is empty');
            return;
        }
        
        // Set the image source and alt text
        overlayImage.src = imageSrc;
        overlayImage.alt = altText || 'Image Preview';
        overlayImage.classList.remove('loaded');
        
        // Show the overlay - force it to be visible
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        imageOverlay.style.display = 'flex';
        imageOverlay.style.zIndex = '10000'; // Ensure it's on top
        
        // Force reflow to ensure transition works
        void imageOverlay.offsetWidth;
        
        // Add active class to trigger animation
        imageOverlay.classList.add('active');
    }
    
    /**
     * Close the image overlay
     */
    function closeImageOverlay() {
        imageOverlay.classList.remove('active');
        
        // After transition completes, reset
        setTimeout(function() {
            imageOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
            // Don't clear src immediately to allow proper transition
            setTimeout(() => {
                overlayImage.src = ''; // Clear image for memory efficiency
            }, 100);
        }, 300); // Match the transition duration
    }
    
    // Make functions globally accessible for debugging
    window.openImageOverlay = openImageOverlay;
    window.closeImageOverlay = closeImageOverlay;
    
    console.log('[ImageOverlay] Initialization complete');
}

// Make function globally accessible
window.initImageOverlay = initImageOverlay;