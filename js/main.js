/**
 * Main JavaScript for Abhijeet's Portfolio Website
 * Handles navigation, content switching, projects filtering, and general interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the portfolio site
    initPortfolio();
});

/**
 * Initialize all portfolio functionality
 */
function initPortfolio() {
    // Navigation
    initNavigation();
    
    // Projects filtering and modal
    initProjects();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Resume functionality
    initResume();
    
    // Skill tooltips
    initSkillTooltips();
    
    // Set animation order for elements
    setAnimationOrder();
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section id from the data attribute
            const sectionId = this.getAttribute('data-section');
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Close mobile menu if open
            const sidebar = document.querySelector('.sidebar');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
            
            // Track page view for analytics
            if (typeof trackPageView === 'function') {
                trackPageView(sectionId);
            }
            
            // Set animation order for elements
            setAnimationOrder();
        });
    });
    
    // Check if there's a hash in the URL and navigate to that section
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const navLink = document.querySelector(`.nav-link[data-section="${hash}"]`);
        if (navLink) {
            navLink.click();
        }
    }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        this.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
        }
    });
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
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
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
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
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
            }
            
            // Track resume view for analytics
            if (typeof trackResumeView === 'function') {
                trackResumeView('view');
            }
        });
    }
    
    if (downloadResumeBtn) {
        // Track resume download for analytics
        downloadResumeBtn.addEventListener('click', function() {
            if (typeof trackResumeView === 'function') {
                trackResumeView('download');
            }
        });
    }
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
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Check if we're switching between mobile and desktop view
    const sidebar = document.querySelector('.sidebar');
    const mobileToggle = document.getElementById('mobile-toggle');
    
    if (window.innerWidth > 767 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        mobileToggle.classList.remove('open');
    }
});
/**
 * Initialize skill tooltips
 */
function initSkillTooltips() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillBar = item.querySelector('.skill-bar');
        const skillProgress = item.querySelector('.skill-progress');
        
        // Get percentage from width style
        const progressStyle = skillProgress.style.width;
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
}