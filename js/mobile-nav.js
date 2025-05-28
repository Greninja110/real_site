/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize mobile navigation
    initMobileNav();

    // Add window resize listener to handle device size changes
    window.addEventListener('resize', function () {
        handleDeviceLayout();
    });

    // Listen for theme toggle to maintain navigation state
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
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
        mobileThemeToggle.addEventListener('change', function () {
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
 * Initialize mobile navigation functionality with enhanced transitions
 */
function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const body = document.body;
    const sidebarFooter = document.querySelector('.sidebar-footer');


    // Initial setup based on device size
    handleDeviceLayout();

    // Toggle functionality for mobile menu and single page mode
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function (e) {
            // On mobile: Just toggle the sidebar open state
            if (window.innerWidth <= 767) {
                sidebar.classList.toggle('open');
                // Don't toggle the mobileToggle class to keep it as 3 lines
                console.log("Mobile view: Toggling menu visibility");
            } else {
                // On desktop/tablet: Toggle between single-page and multi-page mode
                sidebar.classList.toggle('open');
                // Don't toggle the mobileToggle class to keep it as 3 lines

                // Single page mode toggle
                const wasInSinglePageMode = body.classList.contains('single-page-mode');
                body.classList.toggle('single-page-mode');

                if (!wasInSinglePageMode && body.classList.contains('single-page-mode')) {
                    // Switching to single page mode
                    console.log("Enabling single page mode");

                    // Store the currently active section
                    const activeSection = document.querySelector('.section.active');
                    const activeSectionId = activeSection ? activeSection.id : 'home';

                    // Set sidebar to top navigation style
                    sidebar.style.width = '100%';
                    sidebar.style.height = 'var(--header-height, 60px)';
                    sidebar.style.position = 'fixed';
                    sidebar.style.top = '0';
                    sidebar.style.left = '0';
                    sidebar.style.zIndex = '100';

                    // Adjust content position
                    content.style.marginLeft = '0';
                    content.style.width = '100%';
                    content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';

                    // Show all sections
                    showAllSections();

                    // Move footer to bottom
                    if (sidebarFooter) {
                        sidebarFooter.style.position = 'fixed';
                        sidebarFooter.style.bottom = '0';
                        sidebarFooter.style.left = '0';
                        sidebarFooter.style.width = '100%';
                        sidebarFooter.style.borderTop = '1px solid';
                        sidebarFooter.style.borderColor = body.classList.contains('light-theme') ?
                            'var(--light-border)' : 'var(--dark-border)';
                        sidebarFooter.style.textAlign = 'center';
                        sidebarFooter.style.padding = '10px 0';
                        sidebarFooter.style.zIndex = '50';
                        sidebarFooter.style.backgroundColor = body.classList.contains('light-theme') ?
                            'var(--light-sidebar-bg)' : 'var(--dark-sidebar-bg)';
                        sidebarFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
                    }

                    // Scroll to the active section
                    const targetSection = document.getElementById(activeSectionId);
                    if (targetSection) {
                        setTimeout(() => {
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

                    // Center content
                    content.classList.add('centered-content');
                } else if (wasInSinglePageMode && !body.classList.contains('single-page-mode')) {
                    // Switching back to multi-page mode
                    console.log("Disabling single page mode");

                    // Determine which section is most visible in the viewport
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

                    // Reset footer to default
                    if (sidebarFooter) {
                        sidebarFooter.style.position = '';
                        sidebarFooter.style.bottom = '';
                        sidebarFooter.style.left = '';
                        sidebarFooter.style.width = '';
                        sidebarFooter.style.textAlign = '';
                        sidebarFooter.style.padding = '1.5rem';
                        sidebarFooter.style.zIndex = '';
                        sidebarFooter.style.backgroundColor = '';
                        sidebarFooter.style.boxShadow = '';
                    }

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

    // Add smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const sectionId = this.getAttribute('data-section');

            if (body.classList.contains('single-page-mode') && window.innerWidth <= 767) {
                sidebar.classList.add('open');
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
                    if (sidebar.classList.contains('open') && window.innerWidth <= 767) {
                        sidebar.classList.remove('open');
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

    // Listen for screen size changes
    window.addEventListener('resize', function () {
        const newIsMobile = window.innerWidth <= 767;
        const currentIsInSinglePageMode = body.classList.contains('single-page-mode');

        // If mobile but not in single page mode, add the class
        if (newIsMobile && !currentIsInSinglePageMode) {
            body.classList.add('single-page-mode');
            console.log('Switched to single page mode on resize (mobile detected)');
            // Call handleDeviceLayout to properly set up mobile view
            handleDeviceLayout();
        }
    });

    console.log('Navigation initialized');
}

/**
 * Set up the layout based on device size
 */
function handleDeviceLayout() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const sidebarFooter = document.querySelector('.sidebar-footer');

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
        sidebar.style.flexDirection = 'row';
        sidebar.style.flexWrap = 'nowrap';

        // Position content correctly
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 10px)';

        // Set up footer for mobile
        if (sidebarFooter) {
            sidebarFooter.style.position = 'fixed';
            sidebarFooter.style.bottom = '0';
            sidebarFooter.style.left = '0';
            sidebarFooter.style.width = '100%';
            sidebarFooter.style.textAlign = 'center';
            sidebarFooter.style.padding = '10px 0';
            sidebarFooter.style.zIndex = '50';
            sidebarFooter.style.backgroundColor = body.classList.contains('light-theme') ?
                'var(--light-sidebar-bg)' : 'var(--dark-sidebar-bg)';
            sidebarFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
        }

        // Setup intersection observer for section highlighting
        setupIntersectionObserver();
    } else {
        // Desktop/Tablet: Check if we're in single page mode
        if (body.classList.contains('single-page-mode')) {
            // We're in single page mode
            const sidebarNav = document.querySelector('.sidebar-nav');
            const sidebarHeader = document.querySelector('.sidebar-header');
            const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
            
            // Arrange sidebar as a row
            sidebar.style.flexDirection = 'row';
            sidebar.style.flexWrap = 'nowrap';
            
            if (sidebarHeader) {
                sidebarHeader.style.order = '1';
                sidebarHeader.style.flex = '0 0 auto';
                sidebarHeader.style.width = 'auto';
            }
            
            if (sidebarNav) {
                sidebarNav.style.display = 'flex';
                sidebarNav.style.visibility = 'visible';
                sidebarNav.style.opacity = '1';
                sidebarNav.style.order = '2';
                sidebarNav.style.flex = '1';
                sidebarNav.style.position = 'static';
                sidebarNav.style.width = 'auto';
                sidebarNav.style.height = '100%';
                sidebarNav.style.justifyContent = 'center';
                sidebarNav.style.marginTop = '0';
            }

            if (mobileThemeToggle) {
                mobileThemeToggle.style.order = '3';
                mobileThemeToggle.style.marginLeft = 'auto';
            }
            
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

            // Set up footer for single page mode
            if (sidebarFooter) {
                sidebarFooter.style.position = 'fixed';
                sidebarFooter.style.bottom = '0';
                sidebarFooter.style.left = '0';
                sidebarFooter.style.width = '100%';
                sidebarFooter.style.textAlign = 'center';
                sidebarFooter.style.padding = '10px 0';
                sidebarFooter.style.zIndex = '50';
                sidebarFooter.style.backgroundColor = body.classList.contains('light-theme') ?
                    'var(--light-sidebar-bg)' : 'var(--dark-sidebar-bg)';
                sidebarFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
            }

            // Center content
            content.classList.add('centered-content');

            // Setup intersection observer
            setupIntersectionObserver();
        } else {
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

            // Reset footer to default
            if (sidebarFooter) {
                sidebarFooter.style.position = '';
                sidebarFooter.style.bottom = '';
                sidebarFooter.style.left = '';
                sidebarFooter.style.width = '';
                sidebarFooter.style.textAlign = '';
                sidebarFooter.style.padding = '1.5rem';
                sidebarFooter.style.zIndex = '';
                sidebarFooter.style.backgroundColor = '';
                sidebarFooter.style.boxShadow = '';
            }

            // Remove centered content
            content.classList.remove('centered-content');

            // Remove intersection observer
            removeIntersectionObserver();
        }
    }
}

/**
 * Preserve layout state after theme change
 */
function preserveLayoutAfterThemeChange(previousState) {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const sidebarFooter = document.querySelector('.sidebar-footer');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
    
    // First reset all styles to prevent inheritance issues
    if (sidebarNav) {
        sidebarNav.removeAttribute('style');
    }
    if (sidebarHeader) {
        sidebarHeader.removeAttribute('style');
    }
    
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
        sidebar.style.flexDirection = 'row';
        sidebar.style.flexWrap = 'nowrap';

        // Restore sidebar open state if needed
        if (previousState?.sidebarOpen) {
            sidebar.classList.add('open');
        }

        // Ensure content is correctly positioned and styled
        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = 'calc(var(--header-height, 60px) + 20px)';

        // Update the navigation ordering
        if (sidebarHeader) {
            sidebarHeader.style.order = '1';
            sidebarHeader.style.flex = '0 0 auto';
            sidebarHeader.style.width = 'auto';
        }
        
        if (sidebarNav) {
            sidebarNav.style.display = 'flex !important';
            sidebarNav.style.visibility = 'visible';
            sidebarNav.style.opacity = '1';
            sidebarNav.style.order = '2';
            sidebarNav.style.flex = '1';
            sidebarNav.style.position = 'static';
            sidebarNav.style.width = 'auto';
            sidebarNav.style.height = '100%';
            sidebarNav.style.justifyContent = 'center';
            sidebarNav.style.marginTop = '0';
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.style.order = '5';
            mobileThemeToggle.style.marginLeft = 'auto';
        }

        // Set up footer for single page mode
        if (sidebarFooter) {
            sidebarFooter.style.position = 'fixed';
            sidebarFooter.style.bottom = '0';
            sidebarFooter.style.left = '0';
            sidebarFooter.style.width = '100%';
            sidebarFooter.style.display = 'block !important';
            sidebarFooter.style.textAlign = 'center';
            sidebarFooter.style.padding = '10px 0';
            sidebarFooter.style.zIndex = '50';
            sidebarFooter.style.backgroundColor = body.classList.contains('light-theme') ?
                'var(--light-sidebar-bg)' : 'var(--dark-sidebar-bg)';
            sidebarFooter.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.1)';
        }

        // Keep content centered
        content.classList.add('centered-content');
    }
    else if (window.innerWidth <= 767) {
        // On mobile, always maintain single page behavior
        body.classList.add('single-page-mode');
        handleDeviceLayout(); // Call this to properly set up mobile view
    }
    else {
        // Regular desktop mode - left sidebar
        body.classList.remove('single-page-mode');
        
        sidebar.style.width = 'var(--sidebar-width, 280px)';
        sidebar.style.height = '100vh';
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.flexDirection = 'column';
        
        content.style.marginLeft = 'var(--sidebar-width, 280px)';
        content.style.width = 'calc(100% - var(--sidebar-width, 280px))';
        content.style.paddingTop = '0';
        
        // Reset sidebar header for multi-page mode
        if (sidebarHeader) {
            sidebarHeader.style.flexDirection = 'column';
            sidebarHeader.style.alignItems = 'center';
            sidebarHeader.style.padding = '2rem 1rem';
            sidebarHeader.style.marginBottom = '0';
            sidebarHeader.style.width = '100%';
        }
        
        // Reset sidebar nav for multi-page mode
        if (sidebarNav) {
            sidebarNav.style.display = 'block';
            sidebarNav.style.visibility = 'visible';
            sidebarNav.style.opacity = '1';
            sidebarNav.style.flex = '1';
            sidebarNav.style.padding = '0 1.5rem';
            sidebarNav.style.marginTop = '0';
            sidebarNav.style.height = 'auto';
        }

        // Reset footer to default
        if (sidebarFooter) {
            sidebarFooter.style.position = '';
            sidebarFooter.style.bottom = '';
            sidebarFooter.style.left = '';
            sidebarFooter.style.width = '';
            sidebarFooter.style.display = 'block';
            sidebarFooter.style.textAlign = '';
            sidebarFooter.style.padding = '1.5rem';
            sidebarFooter.style.zIndex = '';
            sidebarFooter.style.backgroundColor = '';
            sidebarFooter.style.boxShadow = '';
        }

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
            section.classList.add('active'); // Mark all sections as active in single-page mode
        }
    });
    
    // Ensure last-updated is visible in single page mode
    const lastUpdated = document.querySelector('.sidebar-footer .last-updated');
    if (lastUpdated) {
        lastUpdated.style.display = 'flex';
        lastUpdated.style.visibility = 'visible';
        lastUpdated.style.opacity = '1';
    }
}
/**
 * Hide all sections for multi-page mode
 */
function hideAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
        section.style.opacity = '0';
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
            // Only consider entries with high intersection ratio (more visible in viewport)
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
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

                // Update URL hash without scrolling
                const scrollPosition = window.scrollY;
                history.replaceState(null, null, `#${sectionId}`);
                window.scrollTo(0, scrollPosition);
            }
        });
    }, {
        threshold: 0.5, // Increased threshold - section must be 50% visible
        rootMargin: '-10% 0px -10% 0px' // Reduced margins for more accurate detection
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

// Export functions for use in other modules
window.initMobileNav = initMobileNav;
window.handleDeviceLayout = handleDeviceLayout;
window.maintainNavState = preserveLayoutAfterThemeChange;
window.showAllSections = showAllSections;
window.hideAllSections = hideAllSections;