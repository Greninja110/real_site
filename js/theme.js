/**
 * Theme JavaScript for Abhijeet's Portfolio Website
 * Handles theme toggling between light and dark modes
 * with enhanced state preservation
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Initializing theme functionality");
    
    // Initialize theme functionality
    initTheme();
});
// In js/theme.js

function applyTheme(theme) {
    // Preserve single-page-mode class if it exists before clearing body.className
    const isSinglePageModePreviously = document.body.classList.contains('single-page-mode');
    
    document.body.className = theme; // Clears other classes, then sets theme
    
    if (isSinglePageModePreviously) {
        document.body.classList.add('single-page-mode');
    }

    const isLight = theme === 'light-theme';
    const logoImg = document.getElementById('sidebar-logo'); // Get the logo image element

    // --- START: Added code for logo change ---
    if (logoImg) {
        if (isLight) {
            logoImg.src = 'assets/images/icons/light1.svg';
            logoImg.alt = "Abhijeet Logo - Light Theme";
        } else {
            logoImg.src = 'assets/images/icons/dark1.svg';
            logoImg.alt = "Abhijeet Logo - Dark Theme";
        }
    }
    // --- END: Added code for logo change ---
    
    const mainThemeToggle = document.getElementById('theme-toggle');
    const mobileHeaderThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    if (mainThemeToggle) mainThemeToggle.checked = isLight;
    if (mobileHeaderThemeToggle) mobileHeaderThemeToggle.checked = isLight;
    if (themeLabel) themeLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    
    localStorage.setItem('theme', theme);
    // console.log(`Theme applied by applyTheme: ${theme}`);
}

// Ensure the initTheme function correctly calls applyTheme on load
function initTheme() {
    const mainThemeToggle = document.getElementById('theme-toggle');
    const mobileHeaderThemeToggle = document.getElementById('mobile-theme-toggle');
    // const themeLabel = document.getElementById('theme-label'); // Already handled in applyTheme
    
    if (!mainThemeToggle && !mobileHeaderThemeToggle) {
        // console.error("Theme toggle element(s) not found for initTheme");
        return;
    }

    // Load saved theme or set default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme); // This will now also set the logo
    } else {
        applyTheme('dark-theme'); // Default to dark theme, also sets logo
    }

    // Event listener for the main theme toggle
    if (mainThemeToggle) {
        mainThemeToggle.addEventListener('change', function() {
            if (mobileHeaderThemeToggle) {
                mobileHeaderThemeToggle.checked = this.checked;
            }
            // The actual theme change is now based on the toggle's checked state
            const newTheme = this.checked ? 'light-theme' : 'dark-theme';
            
            // Store current layout mode before changing theme
            window.currentLayoutMode = document.body.classList.contains('single-page-mode') ? 'single-page' : 'multi-page';
            applyTheme(newTheme);
            
            setTimeout(() => {
                if (typeof handleCurrentLayout === 'function') {
                    // handleCurrentLayout(); 
                }
            }, 50);
        });
    }

    // Event listener for the mobile header theme toggle
    if (mobileHeaderThemeToggle) {
        mobileHeaderThemeToggle.addEventListener('change', function() {
            if (mainThemeToggle) {
                mainThemeToggle.checked = this.checked;
            }
            const newTheme = this.checked ? 'light-theme' : 'dark-theme';

            window.currentLayoutMode = document.body.classList.contains('single-page-mode') ? 'single-page' : 'multi-page';
            applyTheme(newTheme);

            setTimeout(() => {
                if (typeof handleCurrentLayout === 'function') {
                    // handleCurrentLayout();
                }
            }, 50);
        });
    }
}
// (The rest of your theme.js file, if any, e.g., global function exports)
// window.initTheme = initTheme; // Ensure this is called

// Export functions for use in other modules
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;