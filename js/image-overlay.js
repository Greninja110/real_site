/**
 * Image Overlay JavaScript for Abhijeet's Portfolio
 * Handles the popup display of logo and profile images
 */

// Add this function at the top
function getScrollbarWidth() {
    // Create a temporary div to measure scrollbar width
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    // Create inner div
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculate the difference
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Clean up
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}
/**
 * Fixed Image Overlay JavaScript
 * Resolves the fast-cursor-movement issue
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("[ImageOverlay] Initializing image overlay functionality");
    setTimeout(initImageOverlay, 200);
});

function initImageOverlay() {
    // Get overlay elements
    const imageOverlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');
    const closeOverlay = document.querySelector('.close-overlay');

    if (!imageOverlay || !overlayImage || !closeOverlay) {
        console.error("[ImageOverlay] Required overlay elements not found");
        return;
    }

    // KEY FIX: Use capture phase event listeners on document
    document.addEventListener('click', function (e) {
        // Check for clicks on profile image or logo
        const isLogo = e.target.id === 'sidebar-logo' ||
            e.target.classList.contains('profile-pic-small');
        const isProfilePic = e.target.classList.contains('profile-pic') ||
            (e.target.parentElement &&
                e.target.parentElement.classList.contains('profile-image-container'));

        if (isLogo) {
            e.preventDefault();
            e.stopPropagation();
            console.log("[ImageOverlay] Logo clicked with capture phase");
            openImageOverlay(e.target.src, 'Abhijeet Logo');
            return false;
        } else if (isProfilePic) {
            e.preventDefault();
            e.stopPropagation();
            console.log("[ImageOverlay] Profile pic clicked with capture phase");
            openImageOverlay(e.target.src, 'Abhijeet Profile');
            return false;
        }
    }, true); // <-- true enables capture phase (very important!)

    // Add direct event handlers as well for redundancy
    const sidebarLogo = document.getElementById('sidebar-logo');
    const profilePic = document.querySelector('.profile-image-container img') ||
        document.querySelector('.profile-pic');

    if (sidebarLogo) {
        console.log("[ImageOverlay] Adding direct click handler to logo");
        sidebarLogo.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("[ImageOverlay] Logo clicked directly");
            openImageOverlay(this.src, 'Abhijeet Logo');
            return false;
        };
    }

    if (profilePic) {
        console.log("[ImageOverlay] Adding direct click handler to profile pic");
        profilePic.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("[ImageOverlay] Profile pic clicked directly");
            openImageOverlay(this.src, 'Abhijeet Profile');
            return false;
        };
    }

    // Close overlay handlers
    closeOverlay.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        closeImageOverlay();
    });

    imageOverlay.addEventListener('click', function (e) {
        if (e.target === imageOverlay) {
            closeImageOverlay();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && imageOverlay.classList.contains('active')) {
            closeImageOverlay();
        }
    });

    // Image loading handler
    overlayImage.addEventListener('load', function () {
        overlayImage.classList.add('loaded');
    });

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

        // Get scrollbar width before hiding it
        const scrollbarWidth = getScrollbarWidth();

        // Prevent scrolling but compensate for scrollbar width
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = scrollbarWidth + 'px';

        // Show the overlay - force it to be visible
        imageOverlay.style.display = 'flex';
        imageOverlay.style.zIndex = '10000'; // Ensure it's on top

        // Force reflow to ensure transition works
        void imageOverlay.offsetWidth;

        // Add active class to trigger animation
        imageOverlay.classList.add('active');
    }

    function closeImageOverlay() {
        imageOverlay.classList.remove('active');

        // After transition completes, reset
        setTimeout(function () {
            imageOverlay.style.display = 'none';

            // Restore scrolling and reset padding in a single operation
            document.body.style.overflow = '';
            document.body.style.paddingRight = '0';

            // Don't clear src immediately to allow proper transition
            setTimeout(() => {
                overlayImage.src = ''; // Clear image for memory efficiency
            }, 100);
        }, 300); // Match the transition duration
    }

    window.openImageOverlay = openImageOverlay;
    window.closeImageOverlay = closeImageOverlay;

    console.log('[ImageOverlay] Initialization complete');
}

window.initImageOverlay = initImageOverlay;