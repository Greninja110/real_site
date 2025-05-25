/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

/**
 * Add this to the top of js/mobile-nav.js
 * This fixes navigation state preservation during theme changes
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile navigation
    initMobileNav();
    
    // Add window resize listener to handle device size changes
    window.addEventListener('resize', function() {
        handleDeviceLayout();
    });
    
    // Listen for theme toggle to maintain navigation state
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            // Store current state before theme change
            const currentState = {
                isSinglePageMode: document.body.classList.contains('single-page-mode'),
                sidebarOpen: document.querySelector('.sidebar').classList.contains('open'),
                activeSection: document.querySelector('.section.active')?.id
            };
            
            // Sync mobile toggle with main toggle
            if (mobileThemeToggle) {
                mobileThemeToggle.checked = themeToggle.checked;
            }
            
            // Apply theme change then restore navigation state
            setTimeout(() => preserveLayoutAfterThemeChange(currentState), 50);
        });
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function() {
            // Store current state before theme change
            const currentState = {
                isSinglePageMode: document.body.classList.contains('single-page-mode'),
                sidebarOpen: document.querySelector('.sidebar').classList.contains('open'),
                activeSection: document.querySelector('.section.active')?.id
            };
            
            // Sync main toggle with mobile toggle
            if (themeToggle) {
                themeToggle.checked = mobileThemeToggle.checked;
                // Trigger the change event on the main toggle
                themeToggle.dispatchEvent(new Event('change'));
            }
            
            // Apply theme change then restore navigation state
            setTimeout(() => preserveLayoutAfterThemeChange(currentState), 50);
        });
    }
});

/**
 * Preserve layout state after theme change
 */
function preserveLayoutAfterThemeChange(previousState) {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    // If we're in single-page mode, ensure it stays that way
    if (previousState?.isSinglePageMode || body.classList.contains('single-page-mode')) {
        console.log("Preserving single-page mode after theme change");
        
        // Make sure the class is applied
        body.classList.add('single-page-mode');
        
        // Re-apply necessary styles
        sidebar.style.width = '100%';
        sidebar.style.height = 'var(--header-height, 60px)';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        
        // Restore sidebar open state if needed
        if (previousState?.sidebarOpen) {
            sidebar.classList.add('open');
        }
        
        // Ensure content is correctly positioned and styled
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';
        
        // Keep content centered
        content.classList.add('centered-content');
    } 
    else if (window.innerWidth <= 767) {
        // On mobile, always maintain single page behavior
        body.classList.add('single-page-mode');
        
        sidebar.style.width = '100%';
        sidebar.style.height = 'var(--header-height, 60px)';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 10px)';
    }
    else {
        // Regular desktop mode - left sidebar
        sidebar.style.width = 'var(--sidebar-width, 280px)';
        sidebar.style.height = '100vh';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        
        content.style.marginLeft = 'var(--sidebar-width, 280px)';
        content.style.width = 'calc(100% - var(--sidebar-width, 280px))';
        content.style.paddingTop = '0';
        
        content.classList.remove('centered-content');
    }
    
    // Restore active section
    if (previousState?.activeSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === previousState.activeSection) {
                link.classList.add('active');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile navigation
    initMobileNav();
    
    // Add window resize listener to handle device size changes
    window.addEventListener('resize', function() {
        handleDeviceLayout();
    });
    
    // Listen for theme toggle to maintain navigation state
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            // Small delay to ensure theme has changed before rechecking layout
            setTimeout(() => {
                maintainNavState();
            }, 50);
        });
    }
    
    // Create log file for debugging
    setupLogger();
});

/**
 * Initialize mobile navigation functionality with enhanced transitions
 */
/**
 * Replace the initMobileNav function in mobile-nav.js with this improved version
 */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const body = document.body;
    
    // Initial setup based on device size
    handleDeviceLayout();
    
    // Toggle functionality for mobile menu and single page mode
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function (e) {
            // Toggle sidebar open state for the menu
            sidebar.classList.toggle('open');
            // Toggle the open class for the mobile toggle button
            mobileToggle.classList.toggle('open');
            
            // Handle different behavior based on screen size
            if (window.innerWidth <= 767) {
                // Mobile: Just toggle the menu visibility
                // Single page mode is always active on mobile
                console.log("Mobile view: Toggling menu visibility only");
            } else {
                // Desktop/Tablet: Toggle between sidebar and top navigation
                const wasInSinglePageMode = body.classList.contains('single-page-mode');
                body.classList.toggle('single-page-mode');
                
                if (!wasInSinglePageMode && body.classList.contains('single-page-mode')) {
                    // Switching to single page mode
                    console.log("Enabling single page mode");
                    
                    // Before showing all sections, store the currently active section
                    const activeSection = document.querySelector('.section.active');
                    const activeSectionId = activeSection ? activeSection.id : 'home';
                    
                    // Show all sections
                    showAllSections();
                    
                    // Scroll to the active section
                    const targetSection = document.getElementById(activeSectionId);
                    if (targetSection) {
                        setTimeout(() => {
                            // Scroll to section with offset for fixed header
                            const headerHeight = 60; // Same as --header-height
                            const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            window.scrollTo({
                                top: sectionTop,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                    
                    // Setup intersection observer for section highlighting
                    setupIntersectionObserver();
                    
                    // Add smooth scroll behavior
                    content.style.scrollBehavior = 'smooth';
                    
                    // Center content
                    content.classList.add('centered-content');
                } else if (wasInSinglePageMode && !body.classList.contains('single-page-mode')) {
                    // Switching back to multi-page mode
                    console.log("Disabling single page mode");
                    
                    // First, determine which section is most visible in the viewport
                    const sections = document.querySelectorAll('.section');
                    let maxVisibleSection = null;
                    let maxVisibleAmount = 0;
                    
                    sections.forEach(section => {
                        const rect = section.getBoundingClientRect();
                        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
                        
                        if (visibleHeight > maxVisibleAmount) {
                            maxVisibleAmount = visibleHeight;
                            maxVisibleSection = section;
                        }
                    });
                    
                    // Hide all sections first
                    hideAllSections();
                    
                    // Then show the most visible section
                    if (maxVisibleSection) {
                        maxVisibleSection.classList.add('active');
                        maxVisibleSection.style.display = 'block';
                        maxVisibleSection.style.opacity = '1';
                        
                        // Update navigation
                        const sectionId = maxVisibleSection.id;
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('data-section') === sectionId) {
                                link.classList.add('active');
                            }
                        });
                        
                        // Update URL hash
                        history.replaceState(null, null, `#${sectionId}`);
                    }
                    
                    // Remove intersection observer
                    removeIntersectionObserver();
                    
                    // Remove centered content
                    content.classList.remove('centered-content');
                }
            }
        });
    }
    
    // Add smooth scrolling for nav links in single page mode
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const sectionId = this.getAttribute('data-section');
            
            if (body.classList.contains('single-page-mode') || window.innerWidth <= 767) {
                e.preventDefault();
                const section = document.getElementById(sectionId);
                
                if (section) {
                    // Scroll to section with offset for fixed header
                    const headerHeight = 60; // Same as --header-height
                    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: sectionTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Close mobile menu in single page mode if it's open
                    if (sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        if (mobileToggle) {
                            mobileToggle.classList.remove('open');
                        }
                    }
                }
            } else {
                // Regular navigation in multi-page mode
                e.preventDefault();
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Hide all sections
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                    section.style.display = 'none';
                    section.style.opacity = '0';
                });
                
                // Show selected section
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    targetSection.style.display = 'block';
                    targetSection.style.opacity = '1';
                }
                
                // Update URL hash
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });
}

/**
 * Add these helper functions to mobile-nav.js
 */
function showAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'stats') { // Skip stats which is admin-only
            section.style.display = 'block';
            section.style.opacity = '1';
            section.classList.add('active'); // Mark all sections as active in single-page mode
        }
    });
}

function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
        section.style.opacity = '0';
    });
}

/**
 * Maintain the current navigation state after theme change
 */
function maintainNavState() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    console.log("Maintaining navigation state after theme change");
    
    // If we're in single-page mode, ensure it stays that way
    if (body.classList.contains('single-page-mode')) {
        console.log("Preserving single-page mode after theme change");
        
        // Re-apply necessary styles
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.width = '100%';
        sidebar.style.height = 'var(--header-height, 60px)';
        
        // Ensure content is correctly positioned and styled
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';
        content.style.scrollBehavior = 'smooth';
        
        // Make sure all sections are visible
        showAllSections();
        
        // Refresh intersection observer
        refreshIntersectionObserver();
        
        // Keep content centered
        content.classList.add('centered-content');
    } else if (window.innerWidth <= 767) {
        // On mobile, always maintain single page behavior
        console.log("Maintaining mobile view behavior");
        
        showAllSections();
        setupIntersectionObserver();
    }
}

/**
 * Replace the handleDeviceLayout function in mobile-nav.js with this improved version
 */
function handleDeviceLayout() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (window.innerWidth <= 767) {
        // Mobile: Always single page mode
        body.classList.add('single-page-mode');
        
        // Show all sections for mobile scrolling
        showAllSections();
        
        // Set up the mobile sidebar styling
        sidebar.style.width = '100%';
        sidebar.style.height = 'var(--header-height, 60px)';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.zIndex = '100';
        
        // Position content correctly
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 10px)';
    } else {
        // Desktop/Tablet: Check if we're in single page mode
        if (!body.classList.contains('single-page-mode')) {
            // Regular multi-page mode
            
            // Make sure only the active section is visible
            const activeSection = document.querySelector('.section.active') || document.getElementById('home');
            document.querySelectorAll('.section').forEach(section => {
                if (section !== activeSection) {
                    section.classList.remove('active');
                    section.style.display = 'none';
                    section.style.opacity = '0';
                } else {
                    section.classList.add('active');
                    section.style.display = 'block';
                    section.style.opacity = '1';
                }
            });
            
            // Reset sidebar to default
            sidebar.style.width = 'var(--sidebar-width, 280px)';
            sidebar.style.height = '100vh';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            
            // Reset content to default
            content.style.marginLeft = 'var(--sidebar-width, 280px)';
            content.style.width = 'calc(100% - var(--sidebar-width, 280px))';
            content.style.paddingTop = '0';
            
            // Remove centered content
            content.classList.remove('centered-content');
        } else {
            // We're in single page mode
            
            // Make all sections visible
            showAllSections();
            
            // Make the sidebar a top navigation
            sidebar.style.width = '100%';
            sidebar.style.height = 'var(--header-height, 60px)';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            
            // Position content correctly
            content.style.marginLeft = '0';
            content.style.width = '100%';
            content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';
            
            // Center content
            content.classList.add('centered-content');
        }
    }
}

/**
 * Show all sections for single page mode
 */
function showAllSections() {
    const sections = document.querySelectorAll('.section');
    console.log(`Showing all ${sections.length} sections for single page mode`);
    
    sections.forEach(section => {
        if (section.id !== 'stats') { // Skip stats which is admin-only
            section.style.display = 'block';
            section.style.opacity = '1';
        }
    });
}

/**
 * Hide non-active sections for multi-page mode
 */
function hideNonActiveSections() {
    const sections = document.querySelectorAll('.section');
    const activeSection = document.querySelector('.section.active');
    
    console.log(`Hiding non-active sections, active section: ${activeSection ? activeSection.id : 'none'}`);
    
    sections.forEach(section => {
        if (!section.classList.contains('active')) {
            section.style.display = 'none';
            section.style.opacity = '0';
        } else {
            section.style.display = 'block';
            section.style.opacity = '1';
        }
    });
}

// IntersectionObserver variables
let observer;

/**
 * Setup intersection observer for highlighting active section in single page mode
 */
function setupIntersectionObserver() {
    // Remove existing observer first
    if (observer) {
        removeIntersectionObserver();
    }
    
    console.log("Setting up intersection observer for section highlighting");
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                const sectionId = entry.target.id;
                
                // Skip stats section (admin-only)
                if (sectionId === 'stats') return;
                
                console.log(`Section in view: ${sectionId}`);
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
                
                // Update URL hash without scrolling (if not on mobile)
                if (window.innerWidth > 767) {
                    const scrollPosition = window.scrollY;
                    history.replaceState(null, null, `#${sectionId}`);
                    window.scrollTo(0, scrollPosition);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // Observe all sections except stats
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'stats') {
            observer.observe(section);
            console.log(`Observing section: ${section.id}`);
        }
    });
}

/**
 * Refresh intersection observer (useful after theme changes)
 */
function refreshIntersectionObserver() {
    console.log("Refreshing intersection observer");
    
    if (observer) {
        removeIntersectionObserver();
    }
    setupIntersectionObserver();
}

/**
 * Remove intersection observer
 */
function removeIntersectionObserver() {
    if (observer) {
        console.log("Removing intersection observer");
        
        document.querySelectorAll('.section').forEach(section => {
            observer.unobserve(section);
        });
        observer = null;
    }
}

/**
 * Add ripple effect to buttons
 */
function addRippleEffect() {
    const buttons = document.querySelectorAll('.filter-btn, .view-details-btn, .view-resume-btn, .download-resume-btn, .email-direct-btn, .timeline-btn, .submit-btn');
    
    console.log(`Adding ripple effect to ${buttons.length} buttons`);
    
    buttons.forEach(button => {
        button.classList.add('btn-ripple');
        
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Setup logger for debugging
 */
function setupLogger() {
    // Create a log file for tracking navigation events
    const navigationLogs = [];
    
    // Store original console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Override console.log to also save to our log array
    console.log = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        const timestamp = new Date().toISOString();
        
        // Add to navigation logs with timestamp
        navigationLogs.push(`[${timestamp}] [LOG] ${message}`);
        
        // Trim logs if too long
        if (navigationLogs.length > 1000) {
            navigationLogs.splice(0, navigationLogs.length - 500);
        }
        
        // Call original console.log
        originalConsoleLog.apply(console, arguments);
    };
    
    // Override console.error
    console.error = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        const timestamp = new Date().toISOString();
        
        // Add to navigation logs with timestamp
        navigationLogs.push(`[${timestamp}] [ERROR] ${message}`);
        
        // Call original console.error
        originalConsoleError.apply(console, arguments);
    };
    
    // Override console.warn
    console.warn = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        const timestamp = new Date().toISOString();
        
        // Add to navigation logs with timestamp
        navigationLogs.push(`[${timestamp}] [WARN] ${message}`);
        
        // Call original console.warn
        originalConsoleWarn.apply(console, arguments);
    };
    
    // Add function to download logs
    window.downloadNavigationLogs = function() {
        const logText = navigationLogs.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'navigation-logs.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("Navigation logs downloaded");
    };
    
    console.log("Navigation logger initialized");
}

// Export functions for use in other modules
window.initMobileNav = initMobileNav;
window.handleDeviceLayout = handleDeviceLayout;
window.maintainNavState = maintainNavState;
window.showAllSections = showAllSections;
window.hideNonActiveSections = hideNonActiveSections;
window.downloadNavigationLogs = window.downloadNavigationLogs || function() {};