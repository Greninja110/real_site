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
// START OF: js/main.js - REPLACE initNavigation function
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    
    console.log(`[MainJS] Found ${sections.length} sections.`);
    
    let sectionToActivateId = 'home'; // Default
    const hash = window.location.hash.substring(1);
    const storedSectionId = localStorage.getItem('activeSectionId');

    if (hash && document.getElementById(hash)) {
        sectionToActivateId = hash;
        console.log(`[MainJS] Activating section from URL hash: ${sectionToActivateId}`);
    } else if (storedSectionId && document.getElementById(storedSectionId)) {
        sectionToActivateId = storedSectionId;
        console.log(`[MainJS] Activating section from localStorage: ${sectionToActivateId}`);
    } else {
        console.log(`[MainJS] Defaulting to home section.`);
    }
    
    // Deactivate all sections and nav links first
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetSectionToActivate = document.getElementById(sectionToActivateId);

    if (targetSectionToActivate) {
        targetSectionToActivate.classList.add('active');
        const correspondingNavLink = document.querySelector(`.nav-link[data-section="${sectionToActivateId}"]`);
        if (correspondingNavLink) {
            correspondingNavLink.classList.add('active');
        }
        localStorage.setItem('activeSectionId', sectionToActivateId); // Update storage

        // If in single-page mode, scroll to the section (especially on page load)
        // The timeout ensures that the layout (especially after theme/mode changes) is stable.
        if (body.classList.contains('single-page-mode')) {
            setTimeout(() => {
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                // Ensure the section is visible before trying to get its position
                if (targetSectionToActivate.style.display !== 'none') {
                    const sectionTop = targetSectionToActivate.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: sectionTop, behavior: 'auto' });
                    console.log(`[MainJS] Scrolled to section ${sectionToActivateId} in single-page mode on load.`);
                }
            }, 150); // Increased delay slightly
        }
    } else {
        console.warn(`[MainJS] Target section '${sectionToActivateId}' not found. Activating 'home'.`);
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
            const homeLink = document.querySelector('.nav-link[data-section="home"]');
            if (homeLink) homeLink.classList.add('active');
            localStorage.setItem('activeSectionId', 'home');
        }
    }
    
    navLinks.forEach((link, index) => {
        link.style.setProperty('--nav-index', index);
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const clickedTargetSection = document.getElementById(sectionId);

            if (!clickedTargetSection) {
                console.error(`[MainJS] Clicked section ${sectionId} not found!`);
                return;
            }

            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            localStorage.setItem('activeSectionId', sectionId);

            if (body.classList.contains('single-page-mode')) {
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                const sectionTop = clickedTargetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            } else {
                sections.forEach(s => s.classList.remove('active'));
                clickedTargetSection.classList.add('active');
                if (window.location.hash !== `#${sectionId}`) {
                     history.pushState(null, null, `#${sectionId}`);
                }
            }
            
            setAnimationOrder(); // Ensure animations are set for the newly active section content

            const sidebar = document.querySelector('.sidebar');S
            if (sidebar && sidebar.classList.contains('open') && window.innerWidth <= 767) {
                sidebar.classList.remove('open');
                document.getElementById('mobile-toggle')?.classList.remove('open');
            }
            console.log(`[MainJS] Navigated to section: ${sectionId}`);
        });
    });

    // Handle window resize for single-page mode logic if not already handled by mobile-nav.js
    // This ensures `handleDeviceLayout` is called if `mobile-nav.js` didn't attach its own listener or was overridden.
    // Note: mobile-nav.js already has a resize listener that calls handleDeviceLayout.
    // This is more of a failsafe or if main.js loads differently.
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (typeof handleDeviceLayout === 'function') {
                // handleDeviceLayout(); // mobile-nav.js should be primary for this
            } else {
                // Basic fallback if handleDeviceLayout isn't global
                const newIsMobile = window.innerWidth <= 767;
                if (newIsMobile && !body.classList.contains('single-page-mode')) {
                    body.classList.add('single-page-mode');
                } else if (!newIsMobile && body.classList.contains('single-page-mode') && localStorage.getItem('navigationMode') !== 'singlePage') {
                    // Only remove if not explicitly set to singlePage on desktop
                    // body.classList.remove('single-page-mode');
                }
            }
        }, 250);
    });
    
    console.log('[MainJS] Navigation initialized.');
}
// END OF: js/main.js - REPLACE initNavigation function

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