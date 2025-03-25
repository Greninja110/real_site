/**
 * Theme JavaScript for Abhijeet's Portfolio Website
 * Handles theme toggling between light and dark modes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme functionality
    initTheme();
});

/**
 * Initialize theme toggle functionality
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Apply saved theme
        document.body.className = savedTheme;
        
        // Update toggle button state
        if (savedTheme === 'light-theme') {
            themeToggle.checked = true;
            themeLabel.textContent = 'Light Mode';
        } else {
            themeToggle.checked = false;
            themeLabel.textContent = 'Dark Mode';
        }
    }
    
    // Add event listener to toggle button
    themeToggle.addEventListener('change', function() {
        toggleTheme();
    });
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    
    if (themeToggle.checked) {
        // Switch to light theme
        document.body.className = 'light-theme';
        themeLabel.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light-theme');
    } else {
        // Switch to dark theme
        document.body.className = 'dark-theme';
        themeLabel.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark-theme');
    }
    
    // Update chart colors if charts exist
    updateChartColors();
}

/**
 * Update chart colors based on current theme
 */
function updateChartColors() {
    // Check if Chart.js is loaded and charts exist
    if (typeof Chart !== 'undefined') {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        // Define colors based on theme
        const textColor = isDarkTheme ? '#e0e0e0' : '#333333';
        const gridColor = isDarkTheme ? '#333333' : '#ddd';
        
        // Update global chart options
        Chart.defaults.color = textColor;
        Chart.defaults.scale.grid.color = gridColor;
        
        // Get all charts
        const charts = Object.values(Chart.instances);
        
        // Update each chart
        charts.forEach(chart => {
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
        });
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