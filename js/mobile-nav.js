/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile navigation
    initMobileNav();
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
    
    // Check if we should enable single page mode by default based on screen size
    function checkDeviceAndSetMode() {
        if (window.innerWidth <= 767) {
            // Enable single page mode by default on mobile
            body.classList.add('single-page-mode');
            
            // Show all sections for mobile (except stats which is admin-only)
            sections.forEach(section => {
                if (section.id !== 'stats') {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                }
            });
            
            // Add smooth scroll behavior
            content.style.scrollBehavior = 'smooth';
            
            // Setup intersection observer for mobile
            setupIntersectionObserver();
            
            // Make sure sidebar is in collapsed state initially on mobile
            sidebar.classList.remove('open');
            if (mobileToggle) mobileToggle.classList.remove('open');
            
        } else {
            // Desktop/tablet: normal mode by default (not single page)
            body.classList.remove('single-page-mode');
            
            // Only show active section initially
            sections.forEach(section => {
                if (!section.classList.contains('active')) {
                    section.style.display = 'none';
                }
            });
            
            // Remove intersection observer for desktop
            removeIntersectionObserver();
        }
    }
    
    // Run on page load
    checkDeviceAndSetMode();
    
    // Run on window resize
    window.addEventListener('resize', function() {
        checkDeviceAndSetMode();
    });
    
    // Toggle functionality for mobile menu and single page mode
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            // Toggle sidebar open state
            sidebar.classList.toggle('open');
            this.classList.toggle('open');
            
            // For desktop/tablet, toggle single page mode
            if (window.innerWidth > 767) {
                if (!body.classList.contains('single-page-mode')) {
                    // Enable single page mode
                    body.classList.add('single-page-mode');
                    
                    // Show all sections
                    sections.forEach(section => {
                        if (section.id !== 'stats') {
                            section.style.display = 'block';
                            section.style.opacity = '1';
                        }
                    });
                    
                    // Add smooth scroll behavior
                    content.style.scrollBehavior = 'smooth';
                    
                    // Setup intersection observer
                    setupIntersectionObserver();
                } else {
                    // Disable single page mode
                    body.classList.remove('single-page-mode');
                    
                    // Reset sections display
                    sections.forEach(section => {
                        if (!section.classList.contains('active')) {
                            section.style.display = 'none';
                        }
                    });
                    
                    // Remove intersection observer
                    removeIntersectionObserver();
                }
            }
        });
    }
    
    // IntersectionObserver for highlighting active section in single page mode
    let observer;
    
    function setupIntersectionObserver() {
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
        sections.forEach(section => {
            if (section.id !== 'stats') {
                observer.observe(section);
            }
        });
    }
    
    function removeIntersectionObserver() {
        if (observer) {
            sections.forEach(section => {
                observer.unobserve(section);
            });
            observer = null;
        }
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
                        mobileToggle.classList.remove('open');
                    }
                }
            } else {
                // Normal navigation in multi-page mode
                // The default click behavior will be handled by main.js
            }
        });
    });
    
    // Add ripple effect to buttons
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