/**
 * Theme JavaScript for Abhijeet's Portfolio Website
 * Handles theme toggling between light and dark modes
 * with enhanced state preservation
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Initializing theme functionality");
    initTheme();
});

function applyTheme(theme) {
    const body = document.body;
    // Preserve single-page-mode class if it exists
    const isSinglePageModePreviously = body.classList.contains('single-page-mode');

    // Set the theme class. This will remove other classes.
    body.className = theme;

    // Re-apply single-page-mode if it was present
    if (isSinglePageModePreviously) {
        body.classList.add('single-page-mode');
    }

    const isLight = theme === 'light-theme';
    const logoImg = document.getElementById('sidebar-logo');

    if (logoImg) {
        if (isLight) {
            logoImg.src = 'assets/images/icons/light1.svg'; // Ensure this path is correct
            logoImg.alt = "Abhijeet Logo - Light Theme";
        } else {
            logoImg.src = 'assets/images/icons/dark1.svg';  // Ensure this path is correct
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
    console.log(`Theme applied: ${theme}. Single page mode preserved: ${isSinglePageModePreviously}`);
}

// START OF: js/theme.js - REPLACE initTheme function
function initTheme() {
    const mainThemeToggle = document.getElementById('theme-toggle');
    const mobileHeaderThemeToggle = document.getElementById('mobile-theme-toggle');
    
    if (!mainThemeToggle && !mobileHeaderThemeToggle) {
        console.error("Theme toggle element(s) not found for initTheme");
        // Attempt to apply a theme anyway if one is saved or based on system pref
        const savedTheme = localStorage.getItem('theme');
        let initialTheme = 'dark-theme'; // Default fallback
        if (savedTheme) {
            initialTheme = savedTheme;
        } else {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                initialTheme = 'light-theme';
            }
            localStorage.setItem('theme', initialTheme); // Save the determined default
        }
        applyTheme(initialTheme); // Apply even if toggles are missing for basic functionality
        return;
    }

    // Load saved theme or set default based on system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        let defaultTheme = 'dark-theme'; // Fallback default
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            defaultTheme = 'light-theme';
        }
        applyTheme(defaultTheme);
        localStorage.setItem('theme', defaultTheme); // Save the determined default
    }

    function handleThemeToggleChange(isChecked) {
        const newTheme = isChecked ? 'light-theme' : 'dark-theme';
        
        // Store current layout state before applying theme
        const currentState = {
            isSinglePageMode: document.body.classList.contains('single-page-mode'),
            sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
            activeSection: document.querySelector('.section.active')?.id || 
                           (document.body.classList.contains('single-page-mode') ? 
                            (document.querySelector('.nav-link.active')?.getAttribute('data-section') || 'home') : 'home')
        };

        applyTheme(newTheme);

        // Call layout preservation/restoration function from mobile-nav.js
        if (typeof window.preserveLayoutAfterThemeChange === 'function') {
            // A short delay might be needed for CSS variables to fully apply before layout adjustments
            setTimeout(() => window.preserveLayoutAfterThemeChange(currentState), 50);
        } else {
            if(typeof window.handleDeviceLayout === 'function') {
                 setTimeout(() => window.handleDeviceLayout(), 50);
            }
            console.warn("preserveLayoutAfterThemeChange not found, layout might need manual refresh or check mobile-nav.js load order.");
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
    console.log("Theme system initialized.");
}
// END OF: js/theme.js - REPLACE initTheme function

// Export functions for use in other modules if needed (though called internally)
window.applyTheme = applyTheme;
window.initTheme = initTheme;