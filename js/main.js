/**
 * Main JavaScript for Abhijeet's Portfolio Website
 * Handles navigation, content switching, projects filtering, and general interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the portfolio site
    initPortfolio();
    console.log('[Main] Portfolio initialized');
});

/**
 * Initialize all portfolio functionality
 */
function initPortfolio() {
    // Setup logging
    setupMainLogger();
    
    // Navigation - This must run first to set up sections correctly
    initNavigation();
    
    // Projects filtering and modal
    initProjects();
    
    // Resume tabs
    initResumeTabs();
    
    // Resume functionality
    initResume();
    
    // Skill tooltips
    initSkillTooltips();
    
    // Set animation order for elements
    setAnimationOrder();
    
    // Log performance stats
    logPerformanceStats();
}

/**
 * Setup main logger
 */
function setupMainLogger() {
    // Create a log array if not exists
    if (!window.mainLogs) {
        window.mainLogs = [];
    }
    
    // Create log function if not exists
    if (!window.logMainEvent) {
        window.logMainEvent = function(message) {
            const timestamp = new Date().toISOString();
            const logEntry = `${timestamp} - ${message}`;
            
            // Add to log array
            window.mainLogs.push(logEntry);
            
            // Log to console for development
            console.log(`[Main] ${message}`);
            
            // If log array gets too long, trim it
            if (window.mainLogs.length > 1000) {
                window.mainLogs = window.mainLogs.slice(-500);
            }
        };
    }
    
    // Add function to download logs
    if (!window.downloadMainLogs) {
        window.downloadMainLogs = function() {
            const logText = window.mainLogs.join('\n');
            const blob = new Blob([logText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'main_logs.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
    }
    
    logMainEvent('Main logger initialized');
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    
    // Debugging - Check what sections exist
    logMainEvent(`Found ${sections.length} sections on the page`);
    sections.forEach(section => {
        logMainEvent(`Section found: ${section.id}`);
    });
    
    // Check if we should be in single page mode based on device width
    const isMobile = window.innerWidth <= 767;
    const isInSinglePageMode = body.classList.contains('single-page-mode');
    
    // If mobile but not in single page mode, add the class
    if (isMobile && !isInSinglePageMode) {
        body.classList.add('single-page-mode');
        logMainEvent('Mobile device detected - Setting single page mode');
    }
    
    // Show the first section by default if no hash in URL
    if (!window.location.hash) {
        // First hide all sections to ensure clean state
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Then activate home section
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
            logMainEvent('Home section activated by default');
            
            // Also make home nav link active
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'home') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            logMainEvent('WARNING: Home section not found!');
        }
    }
    
    // Process URL hash if present
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        logMainEvent(`URL has hash: ${hash}, processing...`);
        
        // Find the section with this ID
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // First hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Then activate target section
            targetSection.classList.add('active');
            logMainEvent(`Activated section from hash: ${hash}`);
            
            // Update nav link active status
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === hash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            logMainEvent(`WARNING: Section with ID ${hash} not found!`);
        }
    }
    
    // Add click event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            logMainEvent(`Nav link clicked for section: ${sectionId}`);
            
            // Check if section exists
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                logMainEvent(`ERROR: Section with ID ${sectionId} does not exist!`);
                return;
            }
            
            // Check if we're in single page mode
            if (body.classList.contains('single-page-mode')) {
                // In single page mode, scroll to the section
                e.preventDefault();
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update nav link active status
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                logMainEvent(`Scrolled to section ${sectionId} in single page mode`);
            } else {
                // In multi-page mode, traditional navigation
                e.preventDefault();
                
                // Update nav link active status
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the target section
                targetSection.classList.add('active');
                
                // Update URL hash
                window.location.hash = sectionId;
                
                // Set animation order for elements
                setAnimationOrder();
                
                logMainEvent(`Section ${sectionId} activated in multi-page mode`);
            }
            
            // Close mobile menu if open
            const sidebar = document.querySelector('.sidebar');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('open');
                logMainEvent('Mobile menu closed after navigation');
            }
            
            // Track page view for analytics
            if (typeof trackPageView === 'function') {
                trackPageView(sectionId);
                logMainEvent(`Page view tracked for section: ${sectionId}`);
            }
        });
    });
    
    // Listen for screen size changes
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 767;
        const currentIsInSinglePageMode = body.classList.contains('single-page-mode');
        
        // If mobile but not in single page mode, add the class
        if (newIsMobile && !currentIsInSinglePageMode) {
            body.classList.add('single-page-mode');
            logMainEvent('Switched to single page mode on resize (mobile detected)');
        }
    });
    
    logMainEvent('Navigation initialized');
}

/**
 * Initialize projects filtering and modal
 */
function initProjects() {
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            logMainEvent(`Project filter applied: ${filter}`);
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter projects
            let visibleCount = 0;
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            logMainEvent(`${visibleCount} projects visible after filtering`);
            
            // Reset animation order
            setAnimationOrder();
        });
    });
    
    // Project modal
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-project-title');
    const modalDescription = document.getElementById('modal-project-description');
    const modalFunctionality = document.getElementById('modal-project-functionality');
    const modalImage = document.getElementById('modal-project-image');
    const modalStatus = document.getElementById('modal-project-status');
    const modalGithub = document.getElementById('modal-project-github');
    const modalDemo = document.getElementById('modal-project-demo');
    const closeModal = document.querySelector('.close-modal');
    
    // Project data
    const projectData = {
        'AI Image Recognition': {
            title: 'AI Image Recognition',
            description: 'An advanced machine learning model that can recognize and classify objects in images with high accuracy. Built using TensorFlow and Keras, this project demonstrates deep learning techniques including convolutional neural networks (CNNs).',
            functionality: 'The system can identify over 1,000 different object categories with 95% accuracy. It includes a user-friendly web interface for uploading images and receiving real-time classification results. The model was trained on a dataset of over 100,000 images and fine-tuned for optimal performance.',
            image: 'assets/images/projects/project1.jpg',
            github: 'https://github.com/abhijeet/ai-image-recognition',
            demo: '#',
            status: 'completed'
        },
        'E-commerce Platform': {
            title: 'E-commerce Platform',
            description: 'A fully-featured e-commerce platform built with a modern tech stack including React, Node.js, and MongoDB. This project includes user authentication, product catalog, shopping cart, and payment processing functionality.',
            functionality: 'Users can browse products, add items to cart, manage their account, and complete purchases using secure payment processing. Admin users have access to a dashboard for managing products, orders, and customer data. The platform is fully responsive and optimized for all devices.',
            image: 'assets/images/projects/project2.jpg',
            github: 'https://github.com/abhijeet/ecommerce-platform',
            demo: '#',
            status: 'ongoing'
        },
        'Fitness Tracker App': {
            title: 'Fitness Tracker App',
            description: 'A mobile application for tracking fitness activities and health metrics. Built using React Native, this app works on both iOS and Android devices and syncs data to a cloud database.',
            functionality: 'The app allows users to log workouts, track progress over time, set goals, and monitor health metrics like weight, heart rate, and sleep quality. It integrates with popular fitness devices and services through their APIs to provide a comprehensive health dashboard.',
            image: 'assets/images/projects/project3.jpg',
            github: 'https://github.com/abhijeet/fitness-tracker',
            demo: '#',
            status: 'planned'
        }
    };
    
    // Open modal when clicking View Details button
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectTitle = this.parentElement.querySelector('h3').textContent;
            logMainEvent(`Project details opened for: ${projectTitle}`);
            
            const project = projectData[projectTitle];
            
            if (project) {
                modalTitle.textContent = project.title;
                modalDescription.textContent = project.description;
                modalFunctionality.textContent = project.functionality;
                modalImage.src = project.image;
                modalImage.alt = project.title;
                modalGithub.href = project.github;
                modalDemo.href = project.demo;
                
                // Set the project status
                if (modalStatus) {
                    modalStatus.textContent = project.status.charAt(0).toUpperCase() + project.status.slice(1);
                    
                    // Remove existing status classes and add the appropriate one
                    modalStatus.classList.remove('completed', 'ongoing', 'planned');
                    modalStatus.classList.add(project.status);
                }
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
            }
        });
    });
    
    // Close modal when clicking the X button
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        logMainEvent('Project modal closed');
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            logMainEvent('Project modal closed (clicked outside)');
        }
    });
    
    logMainEvent('Projects functionality initialized');
}

/**
 * Initialize resume functionality
 */
function initResume() {
    const resumeIframe = document.getElementById('resume-iframe');
    const viewResumeBtn = document.querySelector('.view-resume-btn');
    const downloadResumeBtn = document.querySelector('.download-resume-btn');
    
    if (viewResumeBtn && resumeIframe) {
        // Set iframe source when clicking view button
        viewResumeBtn.addEventListener('click', function(e) {
            // Only prevent default if we're handling it ourselves
            if (resumeIframe.src === '') {
                e.preventDefault();
                resumeIframe.src = this.href;
                logMainEvent(`Resume iframe loaded: ${this.href}`);
            }
            
            // Track resume view for analytics
            if (typeof trackResumeView === 'function') {
                trackResumeView('view');
                logMainEvent('Resume view tracked');
            }
        });
    }
    
    if (downloadResumeBtn) {
        // Track resume download for analytics
        downloadResumeBtn.addEventListener('click', function() {
            if (typeof trackResumeView === 'function') {
                trackResumeView('download');
                logMainEvent('Resume download tracked');
            }
        });
    }
    
    logMainEvent('Resume functionality initialized');
}

/**
 * Set animation order for elements that should be animated sequentially
 */
function setAnimationOrder() {
    // Project cards
    const visibleProjects = document.querySelectorAll('.project-card[style="display: block"], .project-card:not([style])');
    visibleProjects.forEach((project, index) => {
        project.style.setProperty('--animation-order', index);
    });
    
    // Game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
    
    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
    });
    
    // Stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
    
    // Blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        card.style.setProperty('--animation-order', index);
    });
    
    logMainEvent('Animation order set for all elements');
}

/**
 * Initialize skill tooltips
 */
function initSkillTooltips() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillBar = item.querySelector('.skill-bar');
        const skillProgress = item.querySelector('.skill-progress');
        
        if (!skillBar || !skillProgress) return;
        
        // Get percentage from width style
        const progressStyle = skillProgress.style.width;
        if (!progressStyle) return;
        
        const progressPercentage = parseInt(progressStyle);
        
        // Determine skill level based on percentage
        let skillLevel = '';
        if (progressPercentage < 20) {
            skillLevel = 'Basic Knowledge';
        } else if (progressPercentage >= 20 && progressPercentage < 40) {
            skillLevel = 'Beginner';
        } else if (progressPercentage >= 40 && progressPercentage < 60) {
            skillLevel = 'Intermediate';
        } else if (progressPercentage >= 60 && progressPercentage < 80) {
            skillLevel = 'Advanced';
        } else {
            skillLevel = 'Complete Knowledge';
        }
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.textContent = `${progressPercentage}% - ${skillLevel}`;
        
        // Insert tooltip after the skill bar
        skillBar.insertAdjacentElement('afterend', tooltip);
    });
    
    logMainEvent('Skill tooltips initialized');
}

/**
 * Initialize resume tabs functionality
 */
function initResumeTabs() {
    const resumeTabs = document.querySelectorAll('.resume-tab');
    const resumeContents = document.querySelectorAll('.resume-content');
    
    if (resumeTabs.length > 0) {
        resumeTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const resumeType = this.getAttribute('data-resume');
                logMainEvent(`Resume tab selected: ${resumeType}`);
                
                // Remove active class from all tabs
                resumeTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Hide all resume contents
                resumeContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show selected resume content
                const targetContent = document.getElementById(`${resumeType}-resume`);
                if (targetContent) {
                    targetContent.classList.add('active');
                } else {
                    logMainEvent(`ERROR: Resume content with ID ${resumeType}-resume not found!`);
                }
            });
        });
    }
    
    logMainEvent('Resume tabs initialized');
}

/**
 * Log performance statistics
 */
function logPerformanceStats() {
    // GPU info detection
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                logMainEvent(`GPU detected: ${renderer}`);
                
                // Check if RTX 3050 is detected
                if (renderer.includes('RTX') && renderer.includes('3050')) {
                    logMainEvent('RTX 3050 GPU detected - Will use GPU acceleration when available');
                }
            }
        }
    } catch (e) {
        logMainEvent(`Error detecting GPU: ${e.message}`);
    }
    
    // Log navigation timing
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const navigationStart = timing.navigationStart;
        
        const loadTime = timing.loadEventEnd - navigationStart;
        logMainEvent(`Page load time: ${loadTime}ms`);
        
        // Log DOMContentLoaded time
        const domContentLoadedTime = timing.domContentLoadedEventEnd - navigationStart;
        logMainEvent(`DOM Content Loaded time: ${domContentLoadedTime}ms`);
    }
    
    // Log hardware concurrency (CPU cores)
    if (navigator.hardwareConcurrency) {
        logMainEvent(`CPU cores available: ${navigator.hardwareConcurrency}`);
        
        // Check if i7-12650H is likely being used
        if (navigator.hardwareConcurrency >= 10) {
            logMainEvent('High core count detected - likely i7-12650H or similar - Will use multi-threading when available');
        }
    }
    
    // Log memory info if available
    if (navigator.deviceMemory) {
        logMainEvent(`Device memory: ${navigator.deviceMemory}GB`);
        
        // Check if high memory is available
        if (navigator.deviceMemory >= 8) {
            logMainEvent('High memory detected - Will optimize for memory usage');
        }
    }
}

// Make functions globally accessible
window.initPortfolio = initPortfolio;
window.setAnimationOrder = setAnimationOrder;
window.logPerformanceStats = logPerformanceStats;