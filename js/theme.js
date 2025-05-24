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
            if (themeLabel) themeLabel.textContent = 'Light Mode';
        } else {
            themeToggle.checked = false;
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
        }
    }
    else {
        // Set dark theme as default
        document.body.className = 'dark-theme';
        themeToggle.checked = false;
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark-theme');
        console.log("Set dark theme as default");
    }

    // Add event listener to toggle button
    themeToggle.addEventListener('change', function () {
        console.log("Theme toggle clicked");
        
        // Store the current navigation state before theme change
        const isSinglePageMode = document.body.classList.contains('single-page-mode');
        const sidebarOpen = document.querySelector('.sidebar')?.classList.contains('open');
        const activeSection = document.querySelector('.section.active')?.id;
        
        console.log(`Storing state: Single page mode: ${isSinglePageMode}, Sidebar open: ${sidebarOpen}, Active section: ${activeSection}`);
        
        // Toggle theme
        toggleTheme();
        
        // Restore navigation state
        setTimeout(() => {
            restoreNavigationState(isSinglePageMode, sidebarOpen, activeSection);
        }, 50);
    });
    
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
        document.body.className = 'light-theme';
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light-theme');
        console.log("Switched to light theme");
    } else {
        // Switch to dark theme
        document.body.className = 'dark-theme';
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark-theme');
        console.log("Switched to dark theme");
    }

    // Preserve single page mode if active
    if (window.maintainNavState) {
        console.log("Calling maintainNavState to preserve navigation");
        window.maintainNavState();
    } else {
        console.warn("maintainNavState function not available");
    }

    // Update chart colors if charts exist
    updateChartColors();
}

/**
 * Restore navigation state after theme change
 */
function restoreNavigationState(isSinglePageMode, sidebarOpen, activeSection) {
    console.log("Restoring navigation state");
    
    // Restore single page mode
    if (isSinglePageMode) {
        document.body.classList.add('single-page-mode');
        
        // Make sure sidebar has the correct styles
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.width = '100%';
            sidebar.style.height = 'var(--header-height, 60px)';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            
            // Restore open state if needed
            if (sidebarOpen) {
                sidebar.classList.add('open');
            }
        }
        
        // Make sure content has the correct styles
        const content = document.querySelector('.content');
        if (content) {
            content.style.marginLeft = '0';
            content.style.width = '100%';
            content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';
            content.classList.add('centered-content');
        }
        
        // Make sure all sections are visible
        if (window.showAllSections) {
            window.showAllSections();
        }
        
        console.log("Restored single page mode");
    } else {
        // If not in single page mode, make sure the active section is visible
        if (activeSection) {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                if (section.id === activeSection) {
                    section.classList.add('active');
                    section.style.display = 'block';
                    section.style.opacity = '1';
                } else {
                    section.classList.remove('active');
                    section.style.display = 'none';
                    section.style.opacity = '0';
                }
            });
            
            console.log(`Restored active section: ${activeSection}`);
        }
    }
    
    console.log("Navigation state restored");
}

/**
 * Update chart colors based on current theme
 */
function updateChartColors() {
    // Check if Chart.js is loaded and charts exist
    if (typeof Chart !== 'undefined') {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        console.log(`Updating chart colors for ${isDarkTheme ? 'dark' : 'light'} theme`);

        // Define colors based on theme
        const textColor = isDarkTheme ? '#e0e0e0' : '#333333';
        const gridColor = isDarkTheme ? '#333333' : '#ddd';

        // Update global chart options
        Chart.defaults.color = textColor;
        Chart.defaults.scale.grid.color = gridColor;

        // Get all charts
        const charts = Object.values(Chart.instances || {});
        
        console.log(`Found ${charts.length} charts to update`);

        // Update each chart
        charts.forEach((chart, index) => {
            // Update chart scales
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    scale.grid.color = gridColor;
                    scale.ticks.color = textColor;
                });
            }

            // Update chart legend
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }

            // Update the chart
            chart.update();
            console.log(`Updated chart ${index + 1}`);
        });
    } else {
        console.log("Chart.js not loaded or no charts found");
    }
}

/**
 * Get current theme
 * @returns {string} Current theme ('light-theme' or 'dark-theme')
 */
function getCurrentTheme() {
    return document.body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';
}

/**
 * Get theme colors based on current theme
 * @returns {object} Object containing theme colors
 */
function getThemeColors() {
    const isDarkTheme = document.body.classList.contains('dark-theme');

    return {
        primary: isDarkTheme ? '#6c8bff' : '#4361ee',
        secondary: isDarkTheme ? '#a0a0a0' : '#6c757d',
        background: isDarkTheme ? '#121212' : '#f8f9fa',
        cardBackground: isDarkTheme ? '#1e1e1e' : '#ffffff',
        text: isDarkTheme ? '#e0e0e0' : '#333333',
        border: isDarkTheme ? '#333333' : '#dee2e6'
    };
}

// Export functions for use in other modules
window.themeUtils = {
    toggleTheme,
    getCurrentTheme,
    getThemeColors
};

window.initTheme = initTheme;