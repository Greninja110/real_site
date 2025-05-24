/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
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
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    
    console.log("Initializing mobile navigation...");
    
    // Initial setup based on device size
    handleDeviceLayout();
    
    // Toggle functionality for mobile menu and single page mode
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            console.log("Mobile toggle clicked");
            
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
                body.classList.toggle('single-page-mode');
                
                if (body.classList.contains('single-page-mode')) {
                    // Enable single page mode
                    console.log("Enabling single page mode");
                    showAllSections();
                    setupIntersectionObserver();
                    // Add smooth scroll behavior
                    content.style.scrollBehavior = 'smooth';
                    // Center content
                    content.classList.add('centered-content');
                } else {
                    // Disable single page mode
                    console.log("Disabling single page mode");
                    hideNonActiveSections();
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
            console.log(`Nav link clicked: ${sectionId}`);
            
            if (body.classList.contains('single-page-mode') || window.innerWidth <= 767) {
                e.preventDefault();
                const section = document.getElementById(sectionId);
                
                if (section) {
                    console.log(`Scrolling to section: ${sectionId}`);
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
                    
                    // Close mobile menu in single page mode on mobile
                    if (sidebar.classList.contains('open')) {
                        sidebar.classList.remove('open');
                        if (mobileToggle) {
                            mobileToggle.classList.remove('open');
                        }
                        console.log("Closing mobile menu after navigation");
                    }
                }
            } else {
                // Normal navigation in multi-page mode is handled by main.js
                console.log("Multi-page mode: Using default navigation behavior");
            }
        });
    });
    
    // Add ripple effect to buttons
    addRippleEffect();
    
    console.log("Mobile navigation initialized successfully");
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
 * Handle layout based on device size
 */
function handleDeviceLayout() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const mobileToggle = document.getElementById('mobile-toggle');
    
    console.log("Handling device layout based on screen size");
    console.log(`Current window width: ${window.innerWidth}px`);
    
    if (window.innerWidth <= 767) {
        // Mobile: Always single page mode with collapsed navigation
        console.log("Mobile layout detected");
        
        body.classList.add('single-page-mode');
        
        // Show all sections for mobile scrolling
        showAllSections();
        
        // Setup intersection observer for active section highlighting
        setupIntersectionObserver();
        
        // Ensure sidebar has mobile styling
        sidebar.style.width = '100%';
        sidebar.style.height = 'var(--header-height, 60px)';
        sidebar.style.position = 'fixed';
        
        // Position content correctly
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 10px)';
    } else {
        // Desktop/Tablet: Check if we're already in single page mode
        if (!body.classList.contains('single-page-mode')) {
            // Normal mode (not single page)
            console.log("Desktop/tablet normal mode");
            
            hideNonActiveSections();
            removeIntersectionObserver();
            
            // Reset sidebar to default
            sidebar.style.width = 'var(--sidebar-width, 280px)';
            sidebar.style.height = '100vh';
            sidebar.style.position = 'fixed';
            
            // Reset content to default
            content.style.marginLeft = 'var(--sidebar-width, 280px)';
            content.style.width = 'calc(100% - var(--sidebar-width, 280px))';
            content.style.paddingTop = '0';
            
            // Remove centered content
            content.classList.remove('centered-content');
        } else {
            // We are in single page mode
            console.log("Desktop/tablet in single page mode");
            
            showAllSections();
            setupIntersectionObserver();
            
            // Ensure sidebar has top navigation styling
            sidebar.style.width = '100%';
            sidebar.style.height = 'var(--header-height, 60px)';
            sidebar.style.position = 'fixed';
            
            // Position content correctly
            content.style.marginLeft = '0';
            content.style.width = '100%';
            content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';
            
            // Keep content centered
            content.classList.add('centered-content');
        }
    }
    
    console.log("Device layout adjusted successfully");
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