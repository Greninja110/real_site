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

/**
 * Initialize theme toggle functionality
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    if (!themeToggle) {
        console.error("Theme toggle element not found");
        return;
    }
    
    console.log("Setting up theme toggle");

    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Apply saved theme
        document.body.className = savedTheme;
        console.log(`Applied saved theme: ${savedTheme}`);

        // Update toggle button state
        if (savedTheme === 'light-theme') {
            themeToggle.checked = true;
            if (mobileThemeToggle) mobileThemeToggle.checked = true;
            if (themeLabel) themeLabel.textContent = 'Light Mode';
        } else {
            themeToggle.checked = false;
            if (mobileThemeToggle) mobileThemeToggle.checked = false;
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
        }
    }
    else {
        // Set dark theme as default
        document.body.className = 'dark-theme';
        themeToggle.checked = false;
        if (mobileThemeToggle) mobileThemeToggle.checked = false;
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark-theme');
        console.log("Set dark theme as default");
    }

    // Add event listener to main toggle button
    themeToggle.addEventListener('change', function () {
        console.log("Theme toggle clicked");
        
        // Store the current navigation state before theme change
        const navigationState = {
            isSinglePageMode: document.body.classList.contains('single-page-mode'),
            sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
            activeSection: document.querySelector('.section.active')?.id
        };
        
        console.log(`Storing state: Single page mode: ${navigationState.isSinglePageMode}, Sidebar open: ${navigationState.sidebarOpen}, Active section: ${navigationState.activeSection}`);
        
        // Toggle theme
        toggleTheme();
        
        // Sync mobile toggle if it exists
        if (mobileThemeToggle) {
            mobileThemeToggle.checked = themeToggle.checked;
        }
        
        // Restore navigation state
        setTimeout(() => {
            if (typeof window.maintainNavState === 'function') {
                window.maintainNavState(navigationState);
            }
        }, 50);
    });
    
    // Add event listener to mobile toggle button if it exists
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function () {
            console.log("Mobile theme toggle clicked");
            
            // Store the current navigation state before theme change
            const navigationState = {
                isSinglePageMode: document.body.classList.contains('single-page-mode'),
                sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
                activeSection: document.querySelector('.section.active')?.id
            };
            
            // Sync with main toggle
            themeToggle.checked = mobileThemeToggle.checked;
            
            // Toggle theme
            toggleTheme();
            
            // Restore navigation state
            setTimeout(() => {
                if (typeof window.maintainNavState === 'function') {
                    window.maintainNavState(navigationState);
                }
            }, 50);
        });
    }
    
    console.log("Theme initialization complete");
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    console.log("Toggling theme");

    if (themeToggle.checked) {
        // Switch to light theme
        document.body.className = document.body.className.replace('dark-theme', 'light-theme');
        if (!document.body.classList.contains('light-theme')) {
            document.body.classList.add('light-theme');
        }
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light-theme');
        console.log("Switched to light theme");
    } else {
        // Switch to dark theme
        document.body.className = document.body.className.replace('light-theme', 'dark-theme');
        if (!document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
        }
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark-theme');
        console.log("Switched to dark theme");
    }
    
    // Preserve single-page mode class if present
    if (document.body.classList.contains('single-page-mode')) {
        document.body.classList.add('single-page-mode');
    }
}

// Export functions for use in other modules
window.toggleTheme = toggleTheme;
window.initTheme = initTheme;