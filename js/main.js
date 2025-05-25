/**
 * Main JavaScript for Abhijeet's Portfolio Website
 * Handles navigation, content switching, projects filtering, and general interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("[Main] DOM content loaded, initializing portfolio");
    
    // Add a small delay to ensure all elements are ready
    setTimeout(function() {
        try {
            initPortfolio();
            console.log('[Main] Portfolio successfully initialized');
        } catch (error) {
            console.error('[Main] Error during portfolio initialization:', error);
        }
    }, 100);
});

/**
 * Initialize all portfolio functionality
 */
function initPortfolio() {
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
}

/**
 * Initialize navigation functionality
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    
    // Debugging - Check what sections exist
    console.log(`Found ${sections.length} sections on the page`);
    sections.forEach(section => {
        console.log(`Section found: ${section.id}`);
    });
    
    // Check if we should be in single page mode based on device width
    const isMobile = window.innerWidth <= 767;
    const isInSinglePageMode = body.classList.contains('single-page-mode');
    
    // If mobile but not in single page mode, add the class
    if (isMobile && !isInSinglePageMode) {
        body.classList.add('single-page-mode');
        console.log('Mobile device detected - Setting single page mode');
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
            console.log('Home section activated by default');
            
            // Also make home nav link active
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'home') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            console.log('WARNING: Home section not found!');
        }
    }
    
    // Process URL hash if present
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        console.log(`URL has hash: ${hash}, processing...`);
        
        // Find the section with this ID
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            // First hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Then activate target section
            targetSection.classList.add('active');
            console.log(`Activated section from hash: ${hash}`);
            
            // Update nav link active status
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === hash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else {
            console.log(`WARNING: Section with ID ${hash} not found!`);
        }
    }
    
    // Add click event listeners to navigation links
    navLinks.forEach((link, index) => {
        // Add nav index for staggered animation
        link.style.setProperty('--nav-index', index);
        
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('data-section');
            console.log(`Nav link clicked for section: ${sectionId}`);
            
            // Check if section exists
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                console.log(`ERROR: Section with ID ${sectionId} does not exist!`);
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
                
                console.log(`Scrolled to section ${sectionId} in single page mode`);
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
                
                console.log(`Section ${sectionId} activated in multi-page mode`);
            }
            
            // Close mobile menu if open
            const sidebar = document.querySelector('.sidebar');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('open');
                console.log('Mobile menu closed after navigation');
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
            console.log('Switched to single page mode on resize (mobile detected)');
            // Call handleDeviceLayout to properly set up mobile view
            if (typeof handleDeviceLayout === 'function') {
                handleDeviceLayout();
            }
        }
    });
    
    console.log('Navigation initialized');
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
            console.log(`Project filter applied: ${filter}`);
            
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
            
            console.log(`${visibleCount} projects visible after filtering`);
            
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
        'Object Detection and Recognition': {
            title: 'Object Detection and Recognition',
            description: 'A machine learning model that can recognize and classify objects in images with high accuracy. Built using TensorFlow and Keras, this project demonstrates deep learning techniques including convolutional neural networks (CNNs).',
            functionality: 'The system can identify over 1,000 different object categories with 95% accuracy. It includes a user-friendly web interface for uploading images and receiving real-time classification results. The model was trained on a dataset of over 100,000 images and fine-tuned for optimal performance.',
            image: 'assets/images/projects/object.png',
            github: 'https://github.com/Greninja110/object-detection',
            demo: '#',
            status: 'completed'
        },
        'Attendance Management System For a College': {
            title: 'Attendance Management System For a College',
            description: 'A fully-featured attendance management system built with Django, JavaScript, and MySQL. This project includes user authentication, student and faculty management, attendance tracking, and reporting.',
            functionality: 'Faculty can mark attendance, generate reports, and track student performance. Students can view their attendance records and get notifications for low attendance. Administrators can manage courses, faculty, and student data through a dashboard.',
            image: 'assets/images/projects/attend.png',
            github: 'https://github.com/Greninja110/attendance-system',
            demo: '#',
            status: 'ongoing'
        },
        'ARCam': {
            title: 'ARCam',
            description: 'A mobile application for augmented reality camera experiences. Built using Kotlin and ARCore, this app overlays digital information onto the real world through the camera view.',
            functionality: 'The app allows users to identify objects in real-time, place virtual objects in the real world, and interact with AR elements. It uses machine learning for object recognition and ARCore for spatial tracking and rendering.',
            image: 'assets/images/projects/ar.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: '#',
            status: 'ongoing'
        },
        'AI-Powered Network Intrusion Detection System': {
            title: 'AI-Powered Network Intrusion Detection System',
            description: 'A network security system that uses machine learning to detect and prevent intrusions. Built with Python, TensorFlow, and network monitoring tools.',
            functionality: 'The system analyzes network traffic in real-time to identify suspicious patterns and potential attacks. It uses a combination of rule-based detection and machine learning models trained on network traffic datasets to identify and flag anomalies.',
            image: 'assets/images/projects/nids.png',
            github: 'https://github.com/Greninja110/ai-nids',
            demo: '#',
            status: 'ongoing'
        }
    };
    
    // Open modal when clicking View Details button
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectTitle = this.parentElement.querySelector('h3').textContent;
            console.log(`Project details opened for: ${projectTitle}`);
            
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
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            console.log('Project modal closed');
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            console.log('Project modal closed (clicked outside)');
        }
    });
    
    console.log('Projects functionality initialized');
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
                console.log(`Resume iframe loaded: ${this.href}`);
            }
        });
    }
    
    console.log('Resume functionality initialized');
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

    
    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
    });
    
    console.log('Animation order set for all elements');
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
    });
    
    console.log('Skill tooltips initialized');
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
                console.log(`Resume tab selected: ${resumeType}`);
                
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
                    console.log(`ERROR: Resume content with ID ${resumeType}-resume not found!`);
                }
            });
        });
    }
    
    console.log('Resume tabs initialized');
}

// Make functions globally accessible
window.initPortfolio = initPortfolio;
window.setAnimationOrder = setAnimationOrder;