/**
 * Image Overlay JavaScript for Abhijeet's Portfolio
 * Handles the popup display of logo and profile images
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("[ImageOverlay] Initializing image overlay functionality");
    initImageOverlay();
});

/**
 * Initialize image overlay functionality
 */
function initImageOverlay() {
    // Elements to make clickable
    const sidebarLogo = document.getElementById('sidebar-logo');
    const profilePic = document.querySelector('.profile-pic');
    
    // Overlay elements
    const imageOverlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');
    const closeOverlay = document.querySelector('.close-overlay');
    
    // Check if elements exist
    if (!sidebarLogo || !profilePic || !imageOverlay || !overlayImage || !closeOverlay) {
        console.error("[ImageOverlay] Required elements not found");
        return;
    }
    
    // Add clickable class to indicate interactivity
    sidebarLogo.parentElement.classList.add('clickable-image');
    profilePic.parentElement.classList.add('clickable-image');
    
    // Performance optimization: Store original image sources
    const sidebarLogoSrc = sidebarLogo.src;
    const profilePicSrc = profilePic.src;
    
    // Create debug information object
    const debugInfo = {
        clickEvents: 0,
        lastOpened: null,
        renderTime: 0,
        deviceInfo: {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            isMobile: window.innerWidth <= 767
        }
    };
    
    // Setup click handlers
    sidebarLogo.addEventListener('click', function(e) {
        e.preventDefault();
        openImageOverlay(sidebarLogoSrc, 'Abhijeet Logo');
        debugInfo.clickEvents++;
        debugInfo.lastOpened = 'logo';
        console.log(`[ImageOverlay] Logo clicked (${debugInfo.clickEvents} total clicks)`);
    });
    
    profilePic.addEventListener('click', function(e) {
        e.preventDefault();
        openImageOverlay(profilePicSrc, 'Abhijeet Profile');
        debugInfo.clickEvents++;
        debugInfo.lastOpened = 'profile';
        console.log(`[ImageOverlay] Profile picture clicked (${debugInfo.clickEvents} total clicks)`);
    });
    
    closeOverlay.addEventListener('click', function() {
        closeImageOverlay();
        console.log('[ImageOverlay] Overlay closed via close button');
    });
    
    imageOverlay.addEventListener('click', function(e) {
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
        const endTime = performance.now();
        debugInfo.renderTime = endTime - debugInfo.startTime;
        overlayImage.classList.add('loaded');
        console.log(`[ImageOverlay] Image loaded in ${debugInfo.renderTime.toFixed(2)}ms`);
    });
    
    /**
     * Open the image overlay with the specified image
     * @param {string} imageSrc - Source URL of the image
     * @param {string} altText - Alt text for the image
     */
    function openImageOverlay(imageSrc, altText) {
        // Save current scroll position
        debugInfo.scrollPosition = window.pageYOffset;
        
        // Start performance measurement
        debugInfo.startTime = performance.now();
        
        // Set the image source and alt text
        overlayImage.src = imageSrc;
        overlayImage.alt = altText;
        overlayImage.classList.remove('loaded');
        
        // Show the overlay
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        imageOverlay.style.display = 'flex';
        
        // Force reflow to ensure transition works
        void imageOverlay.offsetWidth;
        
        // Add active class to trigger animation
        imageOverlay.classList.add('active');
        
        // Log device info on first open
        if (debugInfo.clickEvents === 1) {
            console.log('[ImageOverlay] Device info:', debugInfo.deviceInfo);
        }
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
            overlayImage.src = ''; // Clear image for memory efficiency
        }, 300); // Match the transition duration
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Update device info
        debugInfo.deviceInfo.screenWidth = window.innerWidth;
        debugInfo.deviceInfo.screenHeight = window.innerHeight;
        debugInfo.deviceInfo.isMobile = window.innerWidth <= 767;
    });
    
    // Make debug info available for console debugging
    window.imageOverlayDebug = debugInfo;
    
    console.log('[ImageOverlay] Initialization complete');
}

// Make function globally accessible
window.initImageOverlay = initImageOverlay;