/**
 * Main JavaScript for Abhijeet's Portfolio Website
 * Handles navigation, content switching, projects filtering, and general interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("[Main] DOM content loaded, initializing portfolio");

    // Add a small delay to ensure all elements are ready
    setTimeout(function () {
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
    // Add this line inside initPortfolio() function
    initTitleLink();

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

// Add to js/main.js - inside the initPortfolio() function
function initTitleLink() {
    const titleLink = document.getElementById('title-home-link');
    if (titleLink) {
        titleLink.addEventListener('click', function (e) {
            e.preventDefault();

            // Get home section
            const homeSection = document.getElementById('home');
            if (!homeSection) return;

            // Get all nav links and find the home link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === 'home') {
                    // Simulate a click on the home nav link
                    link.click();
                    console.log('[Navigation] Title clicked, navigated to home section');
                }
            });
        });
        console.log('[Main] Title link initialized');
    }
}



/**
 * Function to ensure URL matches visible section
 */
function updateURLToMatchVisibleSection() {
    const currentSectionId = localStorage.getItem('activeSectionId');
    if (currentSectionId && window.location.hash !== `#${currentSectionId}`) {
        history.replaceState(null, null, `#${currentSectionId}`);
        console.log(`[Navigation] Updated URL to match visible section: ${currentSectionId}`);
    }
}

// Add event listener for layout changes to update URL accordingly
window.addEventListener('layoutChanged', updateURLToMatchVisibleSection);

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    const sections = document.querySelectorAll('.section');

    console.log(`[MainJS] Initializing navigation. Found ${sections.length} sections.`);

    let sectionToActivateId = 'home'; // Default
    const hash = window.location.hash.substring(1);
    const storedSectionId = localStorage.getItem('activeSectionId');

    console.log(`[MainJS] Navigation init - hash: '${hash}', storedSectionId: '${storedSectionId}'`);

    if (hash && document.getElementById(hash)) {
        sectionToActivateId = hash;
        console.log(`[MainJS] Activating section from URL hash: ${sectionToActivateId}`);
        localStorage.setItem('activeSectionId', hash); // Update localStorage with hash
    } else if (storedSectionId && document.getElementById(storedSectionId)) {
        sectionToActivateId = storedSectionId;
        console.log(`[MainJS] Activating section from localStorage: ${sectionToActivateId}`);

        // Update URL hash to match localStorage
        if (window.location.hash !== `#${storedSectionId}`) {
            history.replaceState(null, null, `#${storedSectionId}`);
            console.log(`[MainJS] Updated URL hash to match localStorage: #${storedSectionId}`);
        }
    } else {
        console.log(`[MainJS] Defaulting to 'home' section.`);
        localStorage.setItem('activeSectionId', 'home'); // Ensure default is stored if nothing else found
    }

    // Deactivate all sections and nav links first
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));

    const targetSectionToActivate = document.getElementById(sectionToActivateId);

    if (targetSectionToActivate) {
        targetSectionToActivate.classList.add('active');
        // Remove active class from all nav links first
        navLinks.forEach(navLink => navLink.classList.remove('active'));

        // Add active class to the corresponding nav link
        const correspondingNavLink = document.querySelector(`.nav-link[data-section="${sectionToActivateId}"]`);
        if (correspondingNavLink) {
            correspondingNavLink.classList.add('active');
            console.log(`[MainJS] Activated nav link for section: ${sectionToActivateId}`);
        } else {
            console.warn(`[MainJS] Could not find nav link for section: ${sectionToActivateId}`);
        }

        // If in single-page mode, scroll to the section (especially on page load)
        // This needs to happen after handleDeviceLayout has potentially run and set all sections to display:block
        if (body.classList.contains('single-page-mode')) {
            setTimeout(() => { // Delay to ensure layout is stable after potential mode/theme changes
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()) || 60;

                // Ensure the section is actually part of the layout before scrolling
                if (getComputedStyle(targetSectionToActivate).display !== 'none') {
                    const sectionTop = targetSectionToActivate.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: sectionTop, behavior: 'auto' }); // 'auto' for instant jump on load
                    console.log(`[MainJS] Scrolled to section ${sectionToActivateId} in single-page mode on load.`);
                } else {
                    console.warn(`[MainJS] Target section ${sectionToActivateId} is not displayed. Cannot scroll.`);
                }
            }, 200); // Increased delay slightly for stability
        }
    } else {
        console.warn(`[MainJS] Target section '${sectionToActivateId}' not found. Activating 'home'.`);
        sectionToActivateId = 'home'; // Explicitly set to home for fallback
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.classList.add('active');
            const homeLink = document.querySelector(`.nav-link[data-section="home"]`);
            if (homeLink) homeLink.classList.add('active');
            localStorage.setItem('activeSectionId', 'home');
            if (body.classList.contains('single-page-mode')) {
                setTimeout(() => {
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()) || 60;
                    if (getComputedStyle(homeSection).display !== 'none') {
                        const sectionTop = homeSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({ top: sectionTop, behavior: 'auto' });
                        console.log(`[MainJS] Scrolled to fallback 'home' section in single-page mode on load.`);
                    }
                }, 200);
            }
        }
    }

    navLinks.forEach((link, index) => {
        link.style.setProperty('--nav-index', index); // For staggered animations if any
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const clickedSectionId = this.getAttribute('data-section');
            const clickedTargetSection = document.getElementById(clickedSectionId);

            if (!clickedTargetSection) {
                console.error(`[MainJS] Clicked section ${clickedSectionId} not found!`);
                return;
            }

            // Store current active link
            const previousActiveLink = document.querySelector('.nav-link.active');

            // Update active states
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            localStorage.setItem('activeSectionId', clickedSectionId);

            if (body.classList.contains('single-page-mode')) {
                // Add scrolling class and disable observer temporarily
                document.body.classList.add('scrolling-to-section');
                console.log(`[MainJS] Added scrolling-to-section class for ${clickedSectionId}`);

                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()) || 60;
                const sectionTop = clickedTargetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll with better timing
                window.scrollTo({
                    top: sectionTop,
                    behavior: 'smooth'
                });

                // Remove scrolling class after animation completes
                setTimeout(() => {
                    document.body.classList.remove('scrolling-to-section');

                    // Ensure the correct nav link stays active
                    navLinks.forEach(navLink => {
                        navLink.classList.toggle('active', navLink.getAttribute('data-section') === clickedSectionId);
                    });

                    console.log(`[MainJS] Scroll complete, active section: ${clickedSectionId}`);
                }, 800); // Reduced timeout for better responsiveness

                if (window.location.hash !== `#${clickedSectionId}`) {
                    history.pushState(null, null, `#${clickedSectionId}`);
                }
            } else {
                // Multi-page mode logic remains the same
                sections.forEach(s => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                    s.style.opacity = '0';
                });
                clickedTargetSection.classList.add('active');
                clickedTargetSection.style.display = 'block';
                clickedTargetSection.style.opacity = '1';
                history.pushState(null, null, `#${clickedSectionId}`);
            }

            // Close mobile menu if open
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open') && window.innerWidth <= 767) {
                sidebar.classList.remove('open');
                const mobileToggle = document.getElementById('mobile-toggle');
                if (mobileToggle) mobileToggle.classList.remove('open');
            }
        });
    });

    // Ensure layout is correctly applied after initial setup
    if (typeof handleDeviceLayout === "function") {
        // handleDeviceLayout(); // This is called by initMobileNav typically.
        // If main.js runs later, a re-call might be useful, or ensure initMobileNav runs first.
    }
    setTimeout(() => {
        if (window.syncNavigationWithHash) {
            window.syncNavigationWithHash();
            console.log('[MainJS] Forced sync of navigation with URL hash');
        }
    }, 500);
    console.log('[MainJS] Navigation initialized.');
}


/**
 * Function to properly close modal and restore scroll
 */
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const scrollY = document.body.style.top;

    // Hide modal first
    modal.style.display = 'none';
    modal.style.alignItems = '';
    modal.style.justifyContent = '';
    // Replace the direct closeProjectModal() call with:
    if (projectsRect.bottom < 0 || projectsRect.top > viewportHeight) {
        console.log('[DEBUG] Scrolled out of projects section - fading modal');
        modal.classList.add('closing');
        setTimeout(() => {
            closeProjectModal();
            modal.classList.remove('closing');
        }, 300);
    }

    // Simply remove modal-open class
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    document.body.removeAttribute('data-modal-opening');
    console.log('[DEBUG] Project modal closed, restored scroll to:', parseInt(scrollY || '0') * -1);
}


/**
 * Initialize projects filtering and modal
 */
function initProjects() {
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
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
            description: 'An advanced computer vision application that performs real-time object detection using YOLOv8 on video streams from your Nothing Phone 2 (via IP webcam/ArcCam). The system leverages your RTX 3050 GPU for accelerated inference and features a modern web interface with 3D AR object placement capabilities using Three.js. Includes comprehensive system monitoring, multi-threaded processing, and detailed logging for performance optimization.',
            functionality: 'This real-time computer vision system streams live video from a smartphone to a desktop application that performs intelligent object detection using YOLOv8 neural networks with GPU acceleration for optimal performance. The system features an interactive web interface where users can view detected objects with confidence scores and virtually place 3D furniture models directly onto the video feed through augmented reality capabilities. Advanced multi-threading ensures smooth processing while comprehensive system monitoring displays real-time statistics including CPU, memory, and GPU usage with detailed logging for performance analysis. The application automatically optimizes processing based on available hardware resources and provides intuitive controls for managing detection settings, AR object placement, and viewing different system panels through a modern responsive web interface.',
            image: 'assets/images/projects/object.png',
            github: 'https://github.com/Greninja110/object-detection',
            demo: '#',
            status: 'completed'
        },
        'Django Based College Attendance System': {
            title: 'Django Based College Attendance System',
            description: 'A fully-featured attendance management system built with Django, JavaScript, and PostgreSQL. This project includes user authentication, student and faculty management, attendance tracking, and reporting.',
            functionality: 'Faculty can mark attendance, generate reports, and track student performance. Students can view their attendance records and get notifications for low attendance. Administrators can manage courses, faculty, and student data through a dashboard.',
            image: 'assets/images/projects/attend.png',
            github: 'https://github.com/Greninja110/attendance-system',
            demo: '#',
            status: 'ongoing'
        },
        'ARCam': {
            title: 'ARCam',
            description: 'Phase 1: Android app for streaming camera feed to a Python server with real-time object detection using YOLOv8 and 3D model visualization, setting the foundation for future AR features',
            functionality: 'Android app captures and streams camera/audio in multiple modes (Image/Audio/Video) and quality settings (480p/720p/1080p) to a Python Flask server that processes streams with GPU-accelerated YOLOv8 for real-time object detection, displaying results through a web interface with 3D model overlay capabilities. Features include network optimization, comprehensive logging, and a foundation for future AR implementation.',
            image: 'assets/images/projects/ar.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: 'https://github.com/Greninja110/arcam.launch/releases/download/v1.0.0/app-debug.apk',
            status: 'ongoing'
        },
        // 'AI-Powered Network Intrusion Detection System': {
        //     title: 'AI-Powered Network Intrusion Detection System',
        //     description: 'A network security system that uses machine learning to detect and prevent intrusions. Built with Python, TensorFlow, and network monitoring tools.',
        //     functionality: 'The system analyzes network traffic in real-time to identify suspicious patterns and potential attacks. It uses a combination of rule-based detection and machine learning models trained on network traffic datasets to identify and flag anomalies.',
        //     image: 'assets/images/projects/nids.png',
        //     github: 'https://github.com/Greninja110/ai-nids',
        //     demo: '#',
        //     status: 'ongoing'
        // },
        'StoryGuard': {
            title: 'StoryGuard',
            description: "StoryGuard is a research project that develops a BERT-based machine learning model to identify and classify potentially harmful content in children's narratives. It analyzes both AI-generated and human-authored stories to detect safety violations like violence or mature themes, as well as problematic stereotypes and biases, ensuring age-appropriate content for young readers.",
            functionality: 'The StoryGuard model functions as a multi-label classifier that processes story text and predicts two key aspects: safety violations (violence, scary content, mature themes) and stereotypes/biases (gender, cultural, racial). Trained on a balanced dataset of 2,000 stories across different age categories (3-5, 6-8, 9-12, and 15+), the system determines if content is appropriate for specific age groups, with optimized thresholds to maximize detection accuracy for both AI-generated and human-written content.',
            image: 'assets/images/projects/StoryGuard.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: '#',
            status: 'ongoing'
        },
        'Predict Calorie Expenditure': {
            title: 'Predict Calorie Expenditure',
            description: 'This project leverages machine learning to build predictive models that estimate calorie burn during physical activities based on various exercise and biometric parameters. It implements and compares multiple regression algorithms from simple linear regression to advanced ensemble methods like Random Forest and Gradient Boosting, with the goal of achieving the lowest possible prediction error (RMSE).',
            functionality: 'The functionality includes preprocessing fitness data with one-hot encoding for categorical variables (like Sex), training various regression models with increasing complexity, and evaluating performance using metrics like RMSE and R² score. The implementation features comprehensive logging to track model performance, visualizations of actual vs. predicted calorie values.',
            image: 'assets/images/projects/Calorie.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: '#',
            status: 'ongoing'
        },
        'Portfolio Website': {
            title: 'Portfolio Website',
            description: 'A modern, fully responsive portfolio website built with custom vanilla JavaScript and CSS, featuring dual light/dark themes and adaptive navigation that seamlessly switches between single-page scrolling and multi-page layouts. The site incorporates contemporary design trends including glassmorphism effects, smooth animations, and interactive elements to create an engaging user experience across desktop, tablet, and mobile devices. It serves as a comprehensive digital showcase for technical skills while demonstrating advanced frontend development capabilities through its sophisticated architecture and performance optimization.',
            functionality: 'The website features intelligent theme switching with system preference detection, project filtering capabilities across multiple categories, interactive timeline visualization with scroll-based navigation, and multi-version resume presentation (AI/ML and Web Development focused). Advanced functionality includes intersection observer-based section detection for navigation highlighting, floating mobile navigation with gesture-friendly interactions, image overlay system for enhanced media viewing, and integrated contact form with EmailJS automation. The site automatically adapts its layout and navigation style based on screen size and user interaction patterns, ensuring optimal usability across all devices.',
            image: 'assets/images/projects/portfolio.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: '#',
            status: 'ongoing'
        },
        'Predicting Optimal Fertilizers': {
            title: 'Predicting Optimal Fertilizers',
            description: 'The fertilizer prediction challenge involved predicting the type of fertilizer to be used depending on crop type and soil conditions, particularly focusing on NPK (Nitrogen, Phosphorus, Potassium) content analysis. Participants worked with datasets containing soil chemical properties, crop types, and environmental factors to recommend the most suitable fertilizer for maximizing agricultural yield. The goal was to maximize agricultural yield by recommending appropriate fertilizers based on various input parameters.',
            functionality: 'The functionality involved analyzing 7 key variables including N (Nitrogen content for plant growth and chlorophyll creation), P (Phosphorus for energy storage and transfer in photosynthesis), and K (Potassium content in soil) to predict optimal fertilizer recommendations. The system processes soil composition data, crop requirements, and environmental conditions through machine learning models to output specific fertilizer types that would best support crop growth and maximize yield for given agricultural scenarios.',
            image: 'assets/images/projects/fertilizer.png',
            github: 'https://github.com/Greninja110/arcam',
            demo: '',
            status: 'ongoing'
        }
    };

    // Open modal when clicking View Details button
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    // Track if cursor is over modal
    let isOverModal = false;
    const modalContent = modal.querySelector('.modal-content');
    const modalBody = modal.querySelector('.modal-body');

    modalContent.addEventListener('mouseenter', () => {
        isOverModal = true;
        document.body.style.overflow = 'hidden';
        console.log('[DEBUG] Cursor entered modal - body scroll locked');
    });

    modalContent.addEventListener('mouseleave', () => {
        isOverModal = false;
        document.body.style.overflow = '';
        console.log('[DEBUG] Cursor left modal - body scroll unlocked');
    });

    // Auto-close modal when scrolling out of projects section
    const projectsSection = document.getElementById('projects');
    const checkModalVisibility = () => {
        if (modal.style.display === 'flex') {
            const projectsRect = projectsSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if projects section is out of view
            if (projectsRect.bottom < 0 || projectsRect.top > viewportHeight) {
                console.log('[DEBUG] Scrolled out of projects section - closing modal');
                closeProjectModal();
            }
        }
    };

    // Throttle scroll check for performance
    let scrollTimeout;
    const throttledCheck = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkModalVisibility, 100);
    };

    window.addEventListener('scroll', throttledCheck);

    // Clean up when modal closes
    const originalClose = closeProjectModal;
    window.closeProjectModal = function () {
        window.removeEventListener('scroll', throttledCheck);
        if (modalContent) {
            modalContent.removeEventListener('mouseenter', () => { });
            modalContent.removeEventListener('mouseleave', () => { });
        }
        document.body.style.overflow = '';
        originalClose();
    };

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default behavior
            e.stopPropagation(); // Prevent event bubbling

            // Add a flag to prevent navigation conflicts
            document.body.setAttribute('data-modal-opening', 'true');

            const projectTitle = this.parentElement.querySelector('h3').textContent;
            console.log(`[Main] Project details opened for: ${projectTitle}`);

            const project = projectData[projectTitle];

            if (project) {
                modalTitle.textContent = project.title;
                modalDescription.textContent = project.description;
                modalFunctionality.textContent = project.functionality;
                modalImage.src = project.image;
                modalImage.alt = project.title;

                // Handle GitHub button
                if (project.github && project.github !== '#') {
                    modalGithub.style.display = 'inline-flex';
                    modalGithub.href = project.github;
                } else {
                    modalGithub.style.display = 'none';
                }

                // Handle Live Demo button visibility
                if (project.demo && project.demo !== '#') {
                    modalDemo.style.display = 'inline-flex';
                    modalDemo.href = project.demo;
                } else {
                    modalDemo.style.display = 'none';
                }

                // Set the project status
                if (modalStatus) {
                    modalStatus.textContent = project.status.charAt(0).toUpperCase() + project.status.slice(1);
                    modalStatus.classList.remove('completed', 'ongoing', 'planned');
                    modalStatus.classList.add(project.status);
                }

                // Add modal-open class for styling but don't lock scroll
                document.body.classList.add('modal-open');;

                // Display modal with flex centering
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';

                // Ensure proper positioning on mobile
                if (window.innerWidth <= 767) {
                    setTimeout(() => {
                        const modalContent = modal.querySelector('.modal-content');
                        if (modalContent) {
                            // Reset any inline styles
                            modalContent.style.position = '';
                            modalContent.style.top = '';
                            modalContent.style.left = '';
                            modalContent.style.transform = '';
                        }
                        // Ensure modal body starts at top
                        const modalBody = modal.querySelector('.modal-body');
                        if (modalBody) {
                            modalBody.scrollTop = 0;
                        }
                    }, 10);
                }
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';

                // Ensure modal content is properly positioned
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    // Reset any inline styles first
                    modalContent.style.transform = '';
                    modalContent.style.position = 'relative';
                    modalContent.style.top = '';
                    modalContent.style.left = '';
                    modalContent.style.maxHeight = '90vh';
                }

                // Debug logging
                console.log('[DEBUG] Modal opened from scroll position:', scrollY);
                console.log('[DEBUG] Viewport height:', window.innerHeight);
                // Add debug logging
                console.log('[DEBUG] Modal opened with blur effect');
                console.log('[DEBUG] Modal dimensions:', {
                    width: modal.querySelector('.modal-content').offsetWidth,
                    height: modal.querySelector('.modal-content').offsetHeight,
                    scrollHeight: modal.querySelector('.modal-body').scrollHeight
                });

                // Ensure modal is properly centered after a brief delay
                // setTimeout(() => {
                //     const modalContent = modal.querySelector('.modal-content');
                //     if (modalContent) {
                //         modalContent.style.transform = 'translate(-50%, -45%) scale(1)';
                //     }
                // }, 50);

                // Reset modal scroll position
                setTimeout(() => {
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) {
                        modalContent.scrollTop = 0;
                    }
                    // Remove the flag after modal is fully opened
                    setTimeout(() => {
                        document.body.removeAttribute('data-modal-opening');
                    }, 100);
                }, 100);
            }
        });
    });
    // Update close modal handlers to use the new function
    if (closeModal) {
        closeModal.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeProjectModal();
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeProjectModal();
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
        viewResumeBtn.addEventListener('click', function (e) {
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
    const visibleProjects = document.querySelectorAll('.project-card[style*="display: block"], .project-card:not([style*="display: none"])');
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
        // Note: skillLevel is determined but not used in this function currently.
        // It might be used for a tooltip content that's not shown in this snippet.
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
            tab.addEventListener('click', function () {
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