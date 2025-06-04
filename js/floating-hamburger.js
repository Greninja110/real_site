
/**
 * Floating Hamburger Menu for Mobile (Separate Drawer)
 * Handles the floating hamburger button and a SEPARATE drawer navigation
 */

(function() {
    'use strict';

    let isInitialized = false;
    let floatingHamburger, mobileBackdrop, mobileDrawerMenuElement, body;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function init() {
        floatingHamburger = document.getElementById('floating-hamburger');
        mobileBackdrop = document.getElementById('mobile-backdrop');
        mobileDrawerMenuElement = document.getElementById('mobile-drawer-menu'); // Target the new drawer
        body = document.body;

        if (!floatingHamburger || !mobileBackdrop || !mobileDrawerMenuElement) {
            console.error('[FloatingHamburger] Essential elements (FAB, backdrop, or mobile-drawer-menu) not found.');
            return;
        }

        if (isInitialized) return;

        handleResize(); // Initial setup based on window width

        floatingHamburger.addEventListener('click', toggleMenu);
        mobileBackdrop.addEventListener('click', closeMenu);

        // Close drawer when a nav link inside the NEW drawer is clicked
        mobileDrawerMenuElement.querySelectorAll('.drawer-nav .nav-link').forEach(link => {
            link.addEventListener('click', function() { // Use 'function' to preserve 'this'
                if (mobileDrawerMenuElement.classList.contains('open')) {
                    closeMenu();
                    // Update active state for drawer links
                    updateDrawerLinkActiveState(this);
                    // Main navigation updates (like scrolling) are handled by main.js via hash change
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawerMenuElement.classList.contains('open')) {
                closeMenu();
            }
        });

        window.addEventListener('resize', debounce(handleResize, 250));

        // Listen to main navigation changes (e.g., from scrolling or main nav clicks)
        // to update the active state of links within our separate drawer.
        window.addEventListener('hashchange', syncDrawerLinksWithMainNavigation);
        // Also sync on initial load if main.js/mobile-nav.js has set an active link
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(syncDrawerLinksWithMainNavigation, 200); // Slight delay for main scripts
        });


        isInitialized = true;
        console.log('[FloatingHamburger] Initialized with separate drawer menu.');
    }

    function toggleMenu() {
        if (mobileDrawerMenuElement.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        if (window.innerWidth > 767) return; // Only operate on mobile

        syncDrawerLinksWithMainNavigation(); // Sync before opening

        floatingHamburger.classList.add('open'); // FAB becomes 'X'
        mobileDrawerMenuElement.classList.add('open'); // Trigger drawer slide-up animation

        mobileBackdrop.style.display = 'block';
        void mobileBackdrop.offsetWidth; // Force reflow for transition
        mobileBackdrop.classList.add('active');

        body.style.overflow = 'hidden';
        body.setAttribute('data-drawer-open', 'true');

        // Stagger animation for nav links in the drawer
        mobileDrawerMenuElement.querySelectorAll('.drawer-nav .nav-link').forEach((link, index) => {
            link.style.setProperty('--nav-index', index);
        });

        console.log('[FloatingHamburger] Separate drawer opened.');
    }

    function closeMenu() {
        floatingHamburger.classList.remove('open');
        mobileDrawerMenuElement.classList.remove('open');

        mobileBackdrop.classList.remove('active');
        setTimeout(() => {
            if (!mobileDrawerMenuElement.classList.contains('open')) {
                 mobileBackdrop.style.display = 'none';
            }
        }, 300); // Match CSS transition duration for backdrop

        body.style.overflow = '';
        body.removeAttribute('data-drawer-open');
        console.log('[FloatingHamburger] Separate drawer closed.');
    }

    function handleResize() {
        if (window.innerWidth <= 767) {
            if (floatingHamburger) floatingHamburger.style.display = 'flex';
            // The mobileDrawerMenuElement is always styled as a drawer,
            // its visibility is controlled by the .open class.
        } else {
            // Desktop view
            if (floatingHamburger) floatingHamburger.style.display = 'none';
            if (mobileDrawerMenuElement && mobileDrawerMenuElement.classList.contains('open')) {
                closeMenu(); // Gracefully close if open
            }
            if (mobileBackdrop) {
                 mobileBackdrop.style.display = 'none';
                 mobileBackdrop.classList.remove('active');
            }
            if (body) {
                body.style.overflow = '';
                body.removeAttribute('data-drawer-open');
            }
        }
    }

    // Function to set the active link in the SEPARATE drawer based on the main sidebar's active link
    function syncDrawerLinksWithMainNavigation() {
        if (!mobileDrawerMenuElement || window.innerWidth > 767) return;

        const mainSidebarActiveLink = document.querySelector('aside.sidebar .sidebar-nav .nav-link.active');
        const drawerNavLinks = mobileDrawerMenuElement.querySelectorAll('.drawer-nav .nav-link');
        let activeSectionFound = false;

        drawerNavLinks.forEach(link => link.classList.remove('active')); // Clear previous active

        if (mainSidebarActiveLink) {
            const activeSection = mainSidebarActiveLink.getAttribute('data-section');
            const correspondingDrawerLink = mobileDrawerMenuElement.querySelector(`.drawer-nav .nav-link[data-section="${activeSection}"]`);
            if (correspondingDrawerLink) {
                correspondingDrawerLink.classList.add('active');
                activeSectionFound = true;
            }
        }
        
        // Fallback to URL hash if main sidebar link isn't immediately active (e.g., page load)
        if (!activeSectionFound) {
            const currentHash = window.location.hash.substring(1) || 'home'; // Default to 'home'
            const fallbackDrawerLink = mobileDrawerMenuElement.querySelector(`.drawer-nav .nav-link[data-section="${currentHash}"]`);
            if (fallbackDrawerLink) {
                fallbackDrawerLink.classList.add('active');
            }
        }
    }
    
    // Function to update active state for drawer links when one is clicked directly
    function updateDrawerLinkActiveState(clickedLinkElement) {
        if (!mobileDrawerMenuElement) return;
        mobileDrawerMenuElement.querySelectorAll('.drawer-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        if (clickedLinkElement) {
            clickedLinkElement.classList.add('active');
        }
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for potential external calls or debugging
    window.MobileDrawerMenu = { 
        open: openMenu, 
        close: closeMenu, 
        toggle: toggleMenu, 
        syncLinks: syncDrawerLinksWithMainNavigation 
    };

})();
