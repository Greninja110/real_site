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
    document.getElementById('theme-toggle').addEventListener('change', function() {
        // Small delay to ensure theme has changed before rechecking layout
        setTimeout(() => {
            maintainNavState();
        }, 50);
    });
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
    
    // Initial setup based on device size
    handleDeviceLayout();
    
    // Toggle functionality for mobile menu and single page mode
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            // Toggle sidebar open state
            sidebar.classList.toggle('open');
            
            // Handle different behavior based on screen size
            if (window.innerWidth <= 767) {
                // Mobile: Just toggle the menu visibility
                // Single page mode is always active on mobile
            } else {
                // Desktop/Tablet: Toggle between sidebar and top navigation
                body.classList.toggle('single-page-mode');
                
                if (body.classList.contains('single-page-mode')) {
                    // Enable single page mode
                    showAllSections();
                    setupIntersectionObserver();
                    // Add smooth scroll behavior
                    content.style.scrollBehavior = 'smooth';
                } else {
                    // Disable single page mode
                    hideNonActiveSections();
                    removeIntersectionObserver();
                }
            }
        });
    }
    
    // Add smooth scrolling for nav links in single page mode
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const sectionId = this.getAttribute('data-section');
            
            if (body.classList.contains('single-page-mode')) {
                e.preventDefault();
                const section = document.getElementById(sectionId);
                
                if (section) {
                    // Scroll to section
                    section.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active class
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Close mobile menu in single page mode on mobile
                    if (window.innerWidth <= 767) {
                        sidebar.classList.remove('open');
                    }
                }
            } else {
                // Normal navigation in multi-page mode
                // The default click behavior will be handled by main.js
            }
        });
    });
    
    // Add ripple effect to buttons
    addRippleEffect();
}

/**
 * Maintain the current navigation state after theme change
 */
function maintainNavState() {
    const body = document.body;
    
    // If we're in single-page mode, ensure it stays that way
    if (body.classList.contains('single-page-mode')) {
        const sidebar = document.querySelector('.sidebar');
        const content = document.querySelector('.content');
        
        // Re-apply necessary styles
        showAllSections();
        setupIntersectionObserver();
        content.style.scrollBehavior = 'smooth';
    }
}

/**
 * Handle layout based on device size
 */
function handleDeviceLayout() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const sections = document.querySelectorAll('.section');
    
    if (window.innerWidth <= 767) {
        // Mobile: Always single page mode with collapsed navigation
        body.classList.add('single-page-mode');
        sidebar.classList.remove('open');
        
        // Show all sections for mobile scrolling
        showAllSections();
        
        // Setup intersection observer for active section highlighting
        setupIntersectionObserver();
    } else {
        // Desktop/Tablet: Check if we're already in single page mode
        if (!body.classList.contains('single-page-mode')) {
            // Normal mode (not single page)
            hideNonActiveSections();
            removeIntersectionObserver();
        } else {
            // We are in single page mode
            showAllSections();
            setupIntersectionObserver();
        }
    }
}

/**
 * Show all sections for single page mode
 */
function showAllSections() {
    const sections = document.querySelectorAll('.section');
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
    sections.forEach(section => {
        if (!section.classList.contains('active')) {
            section.style.display = 'none';
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
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                
                // Skip stats section (admin-only)
                if (sectionId === 'stats') return;
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
                
                // Update URL hash without scrolling
                const scrollPosition = window.scrollY;
                window.location.hash = sectionId;
                window.scrollTo(0, scrollPosition);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // Observe all sections except stats
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'stats') {
            observer.observe(section);
        }
    });
}

/**
 * Remove intersection observer
 */
function removeIntersectionObserver() {
    if (observer) {
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
    const buttons = document.querySelectorAll('.filter-btn, .view-details-btn, .view-resume-btn, .download-resume-btn, .email-direct-btn, .timeline-btn');
    
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

// Export functions for use in other modules
window.initMobileNav = initMobileNav;
window.handleDeviceLayout = handleDeviceLayout;
window.maintainNavState = maintainNavState;