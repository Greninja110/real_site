/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

document.addEventListener('DOMContentLoaded', function() {
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
    let isSinglePageMode = false;
    
    // Check if we should show admin content (stats)
    function checkAdminMode() {
        // This is a simple implementation - in a real scenario, you'd use authentication
        // For now, we'll use a localStorage flag for demo purposes
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (isAdmin) {
            body.classList.add('admin-mode');
        } else {
            body.classList.remove('admin-mode');
        }
    }
    
    // Check on load
    checkAdminMode();
    
    // Add a hidden button to toggle admin mode (press A + Shift + Control)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'a' && e.shiftKey && e.ctrlKey) {
            const currentAdminState = localStorage.getItem('isAdmin') === 'true';
            localStorage.setItem('isAdmin', !currentAdminState);
            checkAdminMode();
        }
    });
    
    // Toggle mobile menu with enhanced transitions
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            this.classList.toggle('open');
            
            // Toggle single page mode for mobile
            if (window.innerWidth <= 767) {
                isSinglePageMode = !isSinglePageMode;
                
                if (isSinglePageMode) {
                    // Enable single page mode
                    body.classList.add('single-page-mode');
                    
                    // Show all sections
                    sections.forEach(section => {
                        section.style.display = 'block';
                        section.style.opacity = '1';
                    });
                    
                    // Add smooth scroll behavior
                    content.style.scrollBehavior = 'smooth';
                    
                    // Adjust sidebar for top position
                    sidebar.style.transform = 'translateY(0)';
                    sidebar.style.top = '0';
                    
                    // Add intersection observer to highlight current section in view
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
                    
                    // Reset sidebar
                    sidebar.style.transform = '';
                    
                    // Remove intersection observer
                    removeIntersectionObserver();
                }
            }
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 767) {
            if (!sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target) && 
                sidebar.classList.contains('open') &&
                !isSinglePageMode) {
                sidebar.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 767) {
            // Reset single page mode when returning to desktop
            if (isSinglePageMode) {
                isSinglePageMode = false;
                body.classList.remove('single-page-mode');
                
                // Reset sections display
                sections.forEach(section => {
                    if (!section.classList.contains('active')) {
                        section.style.display = 'none';
                    }
                });
                
                // Reset sidebar
                sidebar.style.transform = '';
                
                // Remove intersection observer
                removeIntersectionObserver();
            }
            
            // Reset mobile menu
            sidebar.classList.remove('open');
            if (mobileToggle) mobileToggle.classList.remove('open');
        }
    });
    
    // IntersectionObserver for highlighting active section in single page mode
    let observer;
    
    function setupIntersectionObserver() {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const sectionId = entry.target.id;
                    
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
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
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
        link.addEventListener('click', function(e) {
            if (isSinglePageMode) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                
                if (section) {
                    // Scroll to section
                    section.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active class
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Close mobile menu in single page mode (optional)
                    // sidebar.classList.remove('open');
                    // mobileToggle.classList.remove('open');
                }
            }
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.filter-btn, .view-details-btn, .view-resume-btn, .download-resume-btn, .email-direct-btn, .timeline-btn');
    buttons.forEach(button => {
        button.classList.add('btn-ripple');
        
        button.addEventListener('click', function(e) {
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