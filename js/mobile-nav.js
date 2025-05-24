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
// Find this section and modify it:
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const body = document.body;
    const sections = document.querySelectorAll('.section');
    let isSinglePageMode = false;

    // Check if we should enable single page mode by default on mobile
    function checkDeviceAndSetMode() {
        if (window.innerWidth <= 767) {
            // Enable single page mode by default on mobile
            body.classList.add('single-page-mode');
            isSinglePageMode = true;

            // Show all sections
            sections.forEach(section => {
                if (section.id !== 'stats' && section.id !== 'blog' && section.id !== 'games') {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                }
            });

            // Add smooth scroll behavior
            content.style.scrollBehavior = 'smooth';
        }
    }

    // Run on page load
    checkDeviceAndSetMode();

    // Toggle functionality
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function () {
            sidebar.classList.toggle('open');
            this.classList.toggle('open');

            // For desktop/tablet, toggle single page mode
            if (window.innerWidth > 767) {
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
        link.addEventListener('click', function (e) {
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