/**
 * Analytics JavaScript for Abhijeet's Portfolio Website
 * Handles stats visualization using Chart.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize stats visualization
    initStatsVisualization();
});

/**
 * Initialize statistics visualization
 */
function initStatsVisualization() {
    // Check if we're on the stats section
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    
    // Listen for navigation to stats section
    const statsLink = document.querySelector(`.nav-link[data-section="stats"]`);
    if (statsLink) {
        statsLink.addEventListener('click', function() {
            // Load stats data and create charts
            loadStatsData();
        });
    }
    
    // If stats section is active initially, load stats
    if (statsSection.classList.contains('active')) {
        loadStatsData();
    }
}

/**
 * Load statistics data and create charts
 */
function loadStatsData() {
    // For this demo, we'll use dummy data
    // In a real implementation, you would fetch data from Firebase or another source
    
    // Create page views chart
    createPageViewsChart(generateDummyPageViewsData());
    
    // Create game stats chart
    createGameStatsChart(generateDummyGameStatsData());
    
    // Create visitors chart
    createVisitorsChart(generateDummyVisitorsData());
    
    // Update resume downloads count
    updateResumeDownloadsCount();
}

/**
 * Create page views chart
 * @param {object} data - Chart data
 */
function createPageViewsChart(data) {
    const chartCanvas = document.getElementById('pageViewsChart');
    
    if (chartCanvas) {
        // Check if chart already exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Get theme colors
        const colors = getThemeColors();
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    }
                }
            }
        });
    }
}

/**
 * Create game stats chart
 * @param {object} data - Chart data
 */
function createGameStatsChart(data) {
    const chartCanvas = document.getElementById('gameStatsChart');
    
    if (chartCanvas) {
        // Check if chart already exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Get theme colors
        const colors = getThemeColors();
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    }
                }
            }
        });
    }
}

/**
 * Create visitors chart
 * @param {object} data - Chart data
 */
function createVisitorsChart(data) {
    const chartCanvas = document.getElementById('visitorsChart');
    
    if (chartCanvas) {
        // Check if chart already exists
        if (chartCanvas.chart) {
            chartCanvas.chart.destroy();
        }
        
        // Get theme colors
        const colors = getThemeColors();
        
        // Create chart
        chartCanvas.chart = new Chart(chartCanvas, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        grid: {
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                            color: colors.border
                        },
                        ticks: {
                            color: colors.text
                        }
                    }
                }
            }
        });
    }
}

/**
 * Update resume downloads count
 */
function updateResumeDownloadsCount() {
    const resumeDownloads = document.getElementById('resume-downloads');
    if (resumeDownloads) {
        // In a real implementation, you would fetch this from Firebase
        // For this demo, we'll use a random number
        resumeDownloads.textContent = Math.floor(Math.random() * 100) + 50;
    }
}

/**
 * Generate dummy page views data
 * @returns {object} Dummy data for chart
 */
function generateDummyPageViewsData() {
    const pages = ['home', 'projects', 'blog', 'games', 'achievements', 'stats', 'resume', 'contact'];
    const dates = getLast7Days();
    
    // Generate datasets
    const datasets = pages.map(page => {
        const color = getColorForPage(page);
        
        return {
            label: page,
            data: dates.map(() => Math.floor(Math.random() * 50) + 10),
            backgroundColor: color,
            borderColor: color,
            borderWidth: 2,
            tension: 0.4
        };
    });
    
    return {
        labels: dates.map(formatDate),
        datasets: datasets
    };
}

/**
 * Generate dummy game stats data
 * @returns {object} Dummy data for chart
 */
function generateDummyGameStatsData() {
    const games = ['Tic-tac-toe', 'Tetris', 'Snake', 'Flappy Bird', 'Tower Building', '8-Puzzle'];
    const playCount = games.map(() => Math.floor(Math.random() * 100) + 20);
    const avgScores = games.map(() => Math.floor(Math.random() * 500) + 100);
    
    // Generate colors
    const colors = games.map((game, index) => getColorForGame(game, index));
    
    return {
        labels: games,
        datasets: [
            {
                label: 'Play Count',
                data: playCount,
                backgroundColor: colors.map(color => color + '88'), // Add alpha
                borderColor: colors,
                borderWidth: 1
            },
            {
                label: 'Avg Score',
                data: avgScores,
                backgroundColor: colors.map(color => color + '44'), // Add lighter alpha
                borderColor: colors,
                borderWidth: 1
            }
        ]
    };
}

/**
 * Generate dummy visitors data
 * @returns {object} Dummy data for chart
 */
function generateDummyVisitorsData() {
    const dates = getLast7Days();
    
    // Generate visitors and page views
    const visitors = dates.map(() => Math.floor(Math.random() * 30) + 5);
    const pageViews = dates.map(() => Math.floor(Math.random() * 100) + 20);
    
    // Get theme colors
    const colors = getThemeColors();
    
    return {
        labels: dates.map(formatDate),
        datasets: [
            {
                label: 'Unique Visitors',
                data: visitors,
                backgroundColor: colors.primary + '88', // Add alpha
                borderColor: colors.primary,
                borderWidth: 2,
                tension: 0.4,
                type: 'line',
                yAxisID: 'y'
            },
            {
                label: 'Page Views',
                data: pageViews,
                backgroundColor: colors.secondary + '44', // Add lighter alpha
                borderColor: colors.secondary,
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y1'
            }
        ]
    };
}

/**
 * Get last 7 days as date strings
 * @returns {string[]} Array of date strings in YYYY-MM-DD format
 */
function getLast7Days() {
    const dates = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    }
    
    return dates;
}

/**
 * Format date string for display
 * @param {string} dateString - Date string in YYYY-M-D format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const parts = dateString.split('-');
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    
    return `${day}/${month}/${year}`;
}

/**
 * Get color for page
 * @param {string} page - Page name
 * @returns {string} Color for page
 */
function getColorForPage(page) {
    const colors = {
        home: '#4361ee',
        projects: '#3a0ca3',
        blog: '#7209b7',
        games: '#f72585',
        achievements: '#4cc9f0',
        stats: '#4895ef',
        resume: '#560bad',
        contact: '#6c757d'
    };
    
    return colors[page] || '#6c757d';
}

/**
 * Get color for game
 * @param {string} game - Game name
 * @param {number} index - Game index
 * @returns {string} Color for game
 */
function getColorForGame(game, index) {
    const colors = [
        '#4361ee',
        '#3a0ca3',
        '#7209b7',
        '#f72585',
        '#4cc9f0',
        '#4895ef'
    ];
    
    return colors[index % colors.length];
}

/**
 * Get theme colors
 * @returns {object} Theme colors
 */
function getThemeColors() {
    // Check if theme utils are available
    if (window.themeUtils && window.themeUtils.getThemeColors) {
        return window.themeUtils.getThemeColors();
    }
    
    // Default colors
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