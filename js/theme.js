/**
 * Theme JavaScript for Abhijeet's Portfolio Website
 * Handles theme toggling between light and dark modes
 * with enhanced state preservation
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Initializing theme functionality");
    initTheme();
    createThemeTransitionOverlay();
});

// Add theme transition overlay to the DOM if it doesn't exist
function createThemeTransitionOverlay() {
    if (!document.querySelector('.theme-transition-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        document.body.appendChild(overlay);
        console.log("[Theme] Created theme transition overlay");
    }
}

function applyTheme(theme) {
    const body = document.body;
    // Preserve single-page-mode class if it exists by reading it BEFORE changing body.className
    const isSinglePageModePreviously = body.classList.contains('single-page-mode');
    const previousTheme = body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
    
    // First, configure transition origin based on current layout
    const overlay = document.querySelector('.theme-transition-overlay');
    if (overlay) {
        overlay.classList.remove('theme-transition-from-top-right', 'theme-transition-from-bottom-left');
        
        if (body.classList.contains('single-page-mode')) {
            // Top navbar mode - transition from top right
            overlay.classList.add('theme-transition-from-top-right');
        } else {
            // Left navbar mode - transition from bottom left
            overlay.classList.add('theme-transition-from-bottom-left');
        }
        
        // Set the overlay to the target theme color before animation
        overlay.classList.remove('light-theme', 'dark-theme');
        overlay.classList.add(theme);
    }
    
    // Start transition animation
    if (overlay && previousTheme !== theme) {
        body.classList.add('theme-transition-active');
        
        // Short delay to ensure transition starts correctly
        setTimeout(() => {
            // Set the theme class. This might remove other classes if body.className is used directly.
            // A safer way is to remove old theme and add new one.
            if (theme === 'light-theme') {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
            }
            
            // Re-apply single-page-mode if it was present
            if (isSinglePageModePreviously && !body.classList.contains('single-page-mode')) {
                body.classList.add('single-page-mode');
            }
            
            // End transition after theme is applied
            setTimeout(() => {
                body.classList.remove('theme-transition-active');
            }, 800); // Match the transition duration in CSS
        }, 50);
    } else {
        // No transition needed, just apply theme directly
        if (theme === 'light-theme') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
        }
        
        // Re-apply single-page-mode if it was present
        if (isSinglePageModePreviously && !body.classList.contains('single-page-mode')) {
            body.classList.add('single-page-mode');
        }
    }

    const isLight = theme === 'light-theme';
    const logoImg = document.getElementById('sidebar-logo');

    if (logoImg) {
        if (isLight) {
            logoImg.src = 'assets/images/icons/light1.svg';
            logoImg.alt = "Abhijeet Logo - Light Theme";
        } else {
            logoImg.src = 'assets/images/icons/dark1.svg';
            logoImg.alt = "Abhijeet Logo - Dark Theme";
        }
    }
    
    const mainThemeToggle = document.getElementById('theme-toggle');
    const mobileHeaderThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    if (mainThemeToggle) mainThemeToggle.checked = isLight;
    if (mobileHeaderThemeToggle) mobileHeaderThemeToggle.checked = isLight;
    if (themeLabel) themeLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    
    localStorage.setItem('theme', theme);
    console.log(`Theme applied: ${theme}. Single page mode was: ${isSinglePageModePreviously}, is now: ${body.classList.contains('single-page-mode')}`);
}

function initTheme() {
    const mainThemeToggle = document.getElementById('theme-toggle');
    const mobileHeaderThemeToggle = document.getElementById('mobile-theme-toggle');
    
    if (!mainThemeToggle && !mobileHeaderThemeToggle) {
        console.warn("Theme toggle element(s) not found for initTheme. Applying stored/default theme.");
    }

    const savedTheme = localStorage.getItem('theme');
    let initialTheme;

    if (savedTheme) {
        initialTheme = savedTheme;
    } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            initialTheme = 'light-theme';
        } else {
            initialTheme = 'dark-theme'; // Fallback default
        }
        localStorage.setItem('theme', initialTheme); // Save the determined default
    }
    applyTheme(initialTheme); // Apply the theme

    function handleThemeToggleChange(isChecked) {
        const newTheme = isChecked ? 'light-theme' : 'dark-theme';
        
        const currentState = {
            isSinglePageMode: document.body.classList.contains('single-page-mode'),
            sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
            activeSection: document.querySelector('.section.active')?.id || 
                           (document.body.classList.contains('single-page-mode') ? 
                            (document.querySelector('.nav-link.active')?.getAttribute('data-section') || 'home') : 
                            (localStorage.getItem('activeSectionId') || 'home'))
        };

        applyTheme(newTheme);

        if (typeof window.preserveLayoutAfterThemeChange === 'function') {
            setTimeout(() => window.preserveLayoutAfterThemeChange(currentState), 50);
        } else {
            console.warn("preserveLayoutAfterThemeChange not found. Layout adjustments might be needed.");
            if (typeof window.handleDeviceLayout === 'function') {
                setTimeout(() => window.handleDeviceLayout(), 50);
            }
        }
    }

    if (mainThemeToggle) {
        mainThemeToggle.addEventListener('change', function() {
            if (mobileHeaderThemeToggle) {
                mobileHeaderThemeToggle.checked = this.checked;
            }
            handleThemeToggleChange(this.checked);
        });
    }

    if (mobileHeaderThemeToggle) {
        mobileHeaderThemeToggle.addEventListener('change', function() {
            if (mainThemeToggle) {
                mainThemeToggle.checked = this.checked;
            }
            handleThemeToggleChange(this.checked);
        });
    }
    console.log("Theme system initialized with theme:", initialTheme);
}

// Export functions for use in other modules if needed (though called internally)
window.applyTheme = applyTheme;
window.initTheme = initTheme;