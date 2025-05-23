/**
 * Analytics JavaScript for Abhijeet's Portfolio Website
 * Handles stats visualization using Chart.js and Firebase
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize stats visualization
    initStatsVisualization();
    
    // Initialize tracking
    initTracking();
});

/**
 * Initialize tracking functionality
 */
function initTracking() {
    // Add navigation tracking
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            trackPageView(sectionId);
        });
    });
    
    // Add resume tracking
    const viewResumeBtn = document.querySelector('.view-resume-btn');
    const downloadResumeBtn = document.querySelector('.download-resume-btn');
    
    if (viewResumeBtn) {
        viewResumeBtn.addEventListener('click', function() {
            trackResumeView('view');
        });
    }
    
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function() {
            trackResumeView('download');
        });
    }
    
    // Track initial page view
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        trackPageView(activeSection.id);
    }
}

/**
 * Initialize statistics visualization
 */
function initStatsVisualization() {
    // Check if we're on the stats section
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    
    // Listen for navigation to stats section
    const statsLink = document.querySelector('.nav-link[data-section="stats"]');
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
    console.log("Loading stats data from Firebase...");
    
    // Create page views chart with real data
    fetchPageViewsData().then(data => {
        console.log("Page views data:", data);
        createPageViewsChart(data);
    }).catch(error => {
        console.error("Error fetching page views:", error);
        // Fallback to dummy data
        createPageViewsChart(generateDummyPageViewsData());
    });
    
    // Create game stats chart with real data
    fetchGameStatsData().then(data => {
        console.log("Game stats data:", data);
        createGameStatsChart(data);
    }).catch(error => {
        console.error("Error fetching game stats:", error);
        // Fallback to dummy data
        createGameStatsChart(generateDummyGameStatsData());
    });
    
    // Create visitors chart with real data
    fetchVisitorsData().then(data => {
        console.log("Visitors data:", data);
        createVisitorsChart(data);
    }).catch(error => {
        console.error("Error fetching visitors data:", error);
        // Fallback to dummy data
        createVisitorsChart(generateDummyVisitorsData());
    });
    
    // Update resume downloads count
    updateResumeDownloadsCountFromFirebase();
}

/**
 * Fetch page views data from Firebase
 */
async function fetchPageViewsData() {
    try {
        const last7Days = getLast7Days();
        const pages = ['home', 'projects', 'blog', 'games', 'Timeline', 'stats', 'resume', 'contact'];
        
        // Fetch data for all days
        const snapshots = await Promise.all(
            last7Days.map(day => {
                console.log(`Fetching pageViews for ${day}`);
                return db.collection('pageViews').doc(day).get();
            })
        );
        
        // Process data for each page
        const datasets = pages.map(page => {
            const color = getColorForPage(page);
            const data = last7Days.map((day, dayIndex) => {
                const doc = snapshots[dayIndex];
                return doc.exists ? (doc.data()[page] || 0) : 0;
            });
            
            return {
                label: page,
                data: data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 2,
                tension: 0.4
            };
        });
        
        return {
            labels: last7Days.map(formatDate),
            datasets: datasets
        };
    } catch (error) {
        console.error("Error in fetchPageViewsData:", error);
        throw error;
    }
}

/**
 * Fetch game stats data from Firebase
 */
async function fetchGameStatsData() {
    try {
        // Get list of games
        const games = ['tic-tac-toe', 'tetris', 'snake', 'flappy-bird', 'tower-building', 'puzzle'];
        const displayNames = ['Tic-tac-toe', 'Tetris', 'Snake', 'Flappy Bird', 'Tower Building', '8-Puzzle'];
        
        // Initialize arrays
        const playCount = Array(games.length).fill(0);
        const avgScores = Array(games.length).fill(0);
        
        // Get game stats from Firebase
        const snapshot = await db.collection('gameStats').get();
        
        // Process data
        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                const gameData = doc.data();
                const gameIndex = games.indexOf(doc.id);
                
                if (gameIndex !== -1) {
                    playCount[gameIndex] = gameData.playCount || 0;
                    avgScores[gameIndex] = gameData.avgScore || 0;
                }
            });
        }
        
        // Generate colors
        const colors = displayNames.map((game, index) => getColorForGame(game, index));
        
        return {
            labels: displayNames,
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
    } catch (error) {
        console.error("Error in fetchGameStatsData:", error);
        throw error;
    }
}

/**
 * Fetch visitors data from Firebase
 */
async function fetchVisitorsData() {
    try {
        const last7Days = getLast7Days();
        
        // Fetch visitors data
        const visitorSnapshots = await Promise.all(
            last7Days.map(day => {
                console.log(`Fetching visitors for ${day}`);
                return db.collection('visitors').doc(day).get();
            })
        );
        
        // Fetch page views data (total for each day)
        const pageViewSnapshots = await Promise.all(
            last7Days.map(day => {
                console.log(`Fetching pageViews total for ${day}`);
                return db.collection('pageViews').doc(day).get();
            })
        );
        
        // Process visitors data
        const visitors = visitorSnapshots.map(doc => doc.exists ? doc.data().count || 0 : 0);
        
        // Calculate total page views for each day
        const pageViews = pageViewSnapshots.map(doc => {
            if (!doc.exists) return 0;
            
            const data = doc.data();
            return Object.values(data).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
        });
        
        // Get theme colors
        const colors = getThemeColors();
        
        return {
            labels: last7Days.map(formatDate),
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
    } catch (error) {
        console.error("Error in fetchVisitorsData:", error);
        throw error;
    }
}

/**
 * Update resume downloads count from Firebase
 */
function updateResumeDownloadsCountFromFirebase() {
    console.log("Fetching resume downloads count from Firebase...");
    const resumeDownloads = document.getElementById('resume-downloads');
    if (resumeDownloads) {
        db.collection('resumeStats').doc('counts').get()
            .then(doc => {
                if (doc.exists) {
                    console.log("Resume stats data:", doc.data());
                    const downloadCount = doc.data().download || 0;
                    resumeDownloads.textContent = downloadCount;
                } else {
                    console.log("No resume stats document found");
                    resumeDownloads.textContent = '0';
                }
            })
            .catch(error => {
                console.error("Error fetching resume downloads:", error);
                resumeDownloads.textContent = '0';
            });
    }
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
 * Generate dummy page views data (fallback if Firebase fails)
 * @returns {object} Dummy data for chart
 */
function generateDummyPageViewsData() {
    const pages = ['home', 'projects', 'blog', 'games', 'Timeline', 'stats', 'resume', 'contact'];
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
 * Generate dummy game stats data (fallback if Firebase fails)
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
 * Generate dummy visitors data (fallback if Firebase fails)
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
        dates.push(`${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`);
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
        Timeline: '#4cc9f0',
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

/**
 * Track game play
 * @param {string} game - Game name
 * @param {number} score - Game score
 */
function trackGamePlay(game, score) {
    console.log(`Tracking game play: ${game}, score: ${score}`);
    db.collection('gameStats').doc(game).get()
        .then(doc => {
            if (doc.exists) {
                // Update existing game stats
                const data = doc.data();
                const playCount = (data.playCount || 0) + 1;
                const totalScore = (data.totalScore || 0) + score;
                const avgScore = Math.round(totalScore / playCount);
                
                db.collection('gameStats').doc(game).update({
                    playCount: playCount,
                    totalScore: totalScore,
                    avgScore: avgScore,
                    lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                // Create new game stats
                db.collection('gameStats').doc(game).set({
                    playCount: 1,
                    totalScore: score,
                    avgScore: score,
                    lastPlayed: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        })
        .catch(error => {
            console.error("Error tracking game play:", error);
        });
}

/**
 * Track page view
 * @param {string} sectionId - Section ID that was viewed
 */
function trackPageView(sectionId) {
    console.log(`Tracking page view: ${sectionId}`);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Update page view counter in Firestore
    db.collection('pageViews').doc(today).get()
        .then(doc => {
            if (doc.exists) {
                // Update existing document
                let views = doc.data();
                views[sectionId] = (views[sectionId] || 0) + 1;
                db.collection('pageViews').doc(today).update(views);
            } else {
                // Create new document for today
                let views = { [sectionId]: 1 };
                db.collection('pageViews').doc(today).set(views);
            }
        })
        .catch(error => {
            console.error("Error tracking page view:", error);
        });
    
    // Also update total visitors
    updateVisitorCount();
}

/**
 * Track resume view/download
 * @param {string} type - Either 'view' or 'download'
 */
function trackResumeView(type) {
    console.log(`Tracking resume ${type}`);
    db.collection('resumeStats').doc('counts').get()
        .then(doc => {
            if (doc.exists) {
                // Update existing counts
                let data = doc.data();
                data[type] = (data[type] || 0) + 1;
                db.collection('resumeStats').doc('counts').update(data);
            } else {
                // Create new document
                let data = { [type]: 1 };
                db.collection('resumeStats').doc('counts').set(data);
            }
        })
        .catch(error => {
            console.error(`Error tracking resume ${type}:`, error);
        });
}

/**
 * Update visitor count
 */
function updateVisitorCount() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const visitorId = localStorage.getItem('visitorId');
    
    if (!visitorId) {
        // New visitor
        const newVisitorId = Date.now().toString();
        localStorage.setItem('visitorId', newVisitorId);
        
        // Update visitor count
        db.collection('visitors').doc(today).get()
            .then(doc => {
                if (doc.exists) {
                    db.collection('visitors').doc(today).update({
                        count: firebase.firestore.FieldValue.increment(1)
                    });
                } else {
                    db.collection('visitors').doc(today).set({
                        count: 1
                    });
                }
            })
            .catch(error => {
                console.error("Error updating visitor count:", error);
            });
    }
}