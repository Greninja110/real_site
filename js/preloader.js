/**
 * Preloader JavaScript for Abhijeet's Portfolio Website
 * Handles the initial loading animation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize preloader
    initPreloader();
});

/**
 * Initialize preloader functionality
 */
// Update in js/preloader.js
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    
    if (!preloader) {
        console.error("Preloader element not found!");
        return; // Exit if preloader element doesn't exist
    }
    
    // Check if this is the first time the user visits the site in this session
    const isFirstVisit = !sessionStorage.getItem('visited');
    
    if (isFirstVisit) {
        // Show preloader
        preloader.style.display = 'flex';
        
        // Only proceed with animation if text element exists
        if (preloaderText) {
            // Start typing animation
            const messages = [
                "Welcome to Abhijeet's Portfolio",
                "Loading awesome content",
                "Preparing something special for you",
                "Almost ready..."
            ];
            
            let messageIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100; // Base typing speed in ms
            
            function type() {
                const currentMessage = messages[messageIndex];
                
                // Only proceed if preloader is still visible
                if (preloader.style.display === 'none') return;
                
                if (isDeleting) {
                    // Removing characters
                    preloaderText.textContent = currentMessage.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50; // Faster when deleting
                } else {
                    // Adding characters
                    preloaderText.textContent = currentMessage.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 100; // Normal speed when typing
                }
                
                // If we finished typing the message
                if (!isDeleting && charIndex === currentMessage.length) {
                    isDeleting = true;
                    typingSpeed = 1000; // Pause at the end of typing
                } 
                // If we deleted the entire message
                else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    messageIndex = (messageIndex + 1) % messages.length; // Move to next message
                    typingSpeed = 500; // Pause before starting to type new message
                }
                
                // Continue the typing animation if preloader is still visible
                if (preloader.style.display !== 'none') {
                    setTimeout(type, typingSpeed);
                }
            }
            
            // Start the typing animation
            type();
        }
        
        // Minimum display time for preloader
        setTimeout(() => {
            // Fade out preloader
            preloader.classList.add('fade-out');
            
            // Hide preloader after fade out animation completes
            setTimeout(() => {
                preloader.style.display = 'none';
                
                // Set session storage to indicate that the user has visited the site
                sessionStorage.setItem('visited', 'true');
            }, 500); // Matches the fade-out animation duration
        }, 3000); // 3 seconds minimum display time
    } else {
        // Hide preloader immediately if not first visit
        preloader.style.display = 'none';
    }
}

/**
 * Show preloader for section transitions
 * @param {string} message - Message to display in preloader
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Resolves when preloader is hidden
 */
function showSectionPreloader(message, duration = 1000) {
    return new Promise((resolve) => {
        const preloader = document.getElementById('preloader');
        const preloaderText = document.getElementById('preloader-text');
        
        if (preloader && preloaderText) {
            // Set message
            preloaderText.textContent = message;
            
            // Show preloader
            preloader.style.display = 'flex';
            preloader.classList.remove('fade-out');
            
            // Hide preloader after duration
            setTimeout(() => {
                // Fade out preloader
                preloader.classList.add('fade-out');
                
                // Hide preloader after fade out animation completes
                setTimeout(() => {
                    preloader.style.display = 'none';
                    preloader.style.visibility = 'hidden'; // Add this line
                    resolve();
                }, 500); // Matches the fade-out animation duration
                
            }, duration);
        } else {
            // Resolve immediately if preloader doesn't exist
            resolve();
        }
    });
}

// Export function for use in other modules
window.showSectionPreloader = showSectionPreloader;