/**
 * Tablet JavaScript for Abhijeet's Portfolio Website
 * Handles specific tablet-related behaviors and adjustments
 */

(function() {
    'use strict';
    
    // For debugging
    const DEBUG = true;
    let logStats = {};
    
    // Track whether tablet JS is initialized
    let isTabletJSInitialized = false;
    
    /**
     * Logging function with stats tracking
     */
    function logTablet(message, type = 'info') {
        if (!DEBUG) return;
        
        // Track log counts by type
        if (!logStats[type]) logStats[type] = 0;
        logStats[type]++;
        
        // Log with timestamp
        const timestamp = new Date().toISOString();
        console.log(`[TabletJS][${timestamp}][${type}] ${message}`);
    }
    
    /**
     * Initialize tablet-specific behaviors
     */
    function initTabletBehaviors() {
        if (isTabletJSInitialized) return;
        
        // Detect if device is a tablet
        const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        if (!isTablet) return;
        
        const startTime = performance.now();
        logTablet('Initializing tablet-specific behaviors', 'init');
        
        // Adjust navbar for better tablet display
        adjustNavbar();
        
        // Fix project card heights
        equalizeProjectCardHeights();
        
        // Apply tablet adjustments regardless of orientation
        applyTabletAdjustments();
        
        // Apply orientation-specific adjustments
        applyOrientationAdjustments();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        
        // Mark as initialized
        isTabletJSInitialized = true;
        
        // Log performance stats
        const endTime = performance.now();
        logTablet(`Tablet behaviors initialized in ${(endTime - startTime).toFixed(2)}ms`, 'performance');
        
        // Log overall stats
        logTablet(`Initialization complete. Stats: ${JSON.stringify(logStats)}`, 'stats');
    }
    
    /**
     * Adjust navbar for tablet view
     */
    function adjustNavbar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarNav = document.querySelector('.sidebar-nav');
        
        if (!sidebar || !sidebarNav) {
            logTablet('Sidebar or sidebarNav not found', 'error');
            return;
        }
        
        // Get device width for responsive adjustments
        const deviceWidth = window.innerWidth;
        
        // Select appropriate font size based on device width
        let fontSize, padding;
        
        if (deviceWidth < 900) {
            fontSize = '0.75rem';
            padding = '0.4rem 0.5rem';
            logTablet('Applying smallest navbar settings for narrow tablet');
        } else if (deviceWidth < 1000) {
            fontSize = '0.8rem';
            padding = '0.45rem 0.55rem';
            logTablet('Applying medium navbar settings for mid-sized tablet');
        } else {
            fontSize = '0.85rem';
            padding = '0.5rem 0.6rem';
            logTablet('Applying larger navbar settings for wide tablet');
        }
        
        // For single page mode (top nav)
        if (document.body.classList.contains('single-page-mode')) {
            logTablet('Adjusting top navbar for tablet');
            
            // Center navbar elements
            sidebarNav.style.display = 'flex';
            sidebarNav.style.justifyContent = 'center';
            
            // Make nav links smaller
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.style.fontSize = fontSize;
                link.style.padding = padding;
                link.style.whiteSpace = 'nowrap';
            });
            
            logTablet(`Adjusted ${navLinks.length} nav links with font-size: ${fontSize}, padding: ${padding}`);
            
            // Fix hamburger button size
            adjustHamburgerButton();
        }
    }
    
    /**
     * Adjust hamburger button size
     */
    function adjustHamburgerButton() {
        const hamburgerBtn = document.getElementById('mobile-toggle') || 
                             document.querySelector('.mobile-toggle');
        
        if (!hamburgerBtn) {
            logTablet('Hamburger button not found', 'warn');
            return;
        }
        
        // Set appropriate size for the container
        hamburgerBtn.style.width = '3rem';
        hamburgerBtn.style.height = '2.75rem';
        hamburgerBtn.style.padding = '0.625rem';
        hamburgerBtn.style.display = 'flex';
        hamburgerBtn.style.flexDirection = 'column';
        hamburgerBtn.style.justifyContent = 'center';
        hamburgerBtn.style.alignItems = 'center';
        
        // Also adjust the spans (lines)
        const spans = hamburgerBtn.querySelectorAll('span');
        spans.forEach(span => {
            span.style.width = '1.5rem';
            span.style.height = '0.1875rem';
            span.style.margin = '0.1875rem 0';
        });
        
        logTablet('Adjusted hamburger button dimensions');
    }
    
    /**
     * Make all project cards equal height
     * Uses requestAnimationFrame for performance
     */
    function equalizeProjectCardHeights() {
        const projectCards = document.querySelectorAll('.project-card');
        
        if (projectCards.length === 0) {
            logTablet('No project cards found', 'warn');
            return;
        }
        
        logTablet(`Equalizing ${projectCards.length} project card heights`);
        
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            // Reset heights first
            projectCards.forEach(card => {
                card.style.height = '';
            });
            
            // Get the max height
            let maxHeight = 0;
            projectCards.forEach(card => {
                const height = card.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
            
            // Apply max height to all cards
            if (maxHeight > 0) {
                projectCards.forEach(card => {
                    card.style.height = `${maxHeight}px`;
                });
                logTablet(`Set all project cards to height: ${maxHeight}px`);
            }
        });
    }
    
    /**
     * Apply tablet adjustments for both orientations
     */
    function applyTabletAdjustments() {
        // Adjust timeline for mobile-like view for both orientations
        adjustTimelineForTablet();
    }
    
    /**
     * Apply orientation-specific adjustments
     */
    function applyOrientationAdjustments() {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        
        if (isPortrait) {
            logTablet('Applying portrait layout adjustments');
            
            // Transform info grid to 1x4
            const infoGrid = document.querySelector('.info-grid');
            if (infoGrid) {
                infoGrid.style.gridTemplateColumns = '1fr';
            }
            
            // Transform contact container to 2x1
            const contactContainer = document.querySelector('.contact-container');
            if (contactContainer) {
                contactContainer.style.gridTemplateColumns = '1fr';
            }
        } else {
            logTablet('Applying landscape layout adjustments');
            
            // Apply 2x1 contact layout for left navbar mode too
            const isLeftNavMode = !document.body.classList.contains('single-page-mode');
            if (isLeftNavMode) {
                const contactContainer = document.querySelector('.contact-container');
                if (contactContainer) {
                    contactContainer.style.gridTemplateColumns = '1fr';
                    contactContainer.style.gridTemplateRows = 'auto auto';
                    logTablet('Applied 2x1 layout to contact section in left navbar mode');
                }
            }
        }
    }
    
    /**
     * Adjust timeline for tablet view (both orientations)
     */
    function adjustTimelineForTablet() {
        const timelineBlocks = document.querySelectorAll('.timeline-block');
        
        if (timelineBlocks.length === 0) {
            logTablet('No timeline blocks found', 'warn');
            return;
        }
        
        logTablet(`Adjusting ${timelineBlocks.length} timeline blocks for tablet view`);
        
        // Ensure the timeline line is centered
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            const timelineLine = timeline.querySelector(':before');
            if (timelineLine) {
                timelineLine.style.left = '50%';
                timelineLine.style.transform = 'translateX(-50%)';
            }
        }
        
        // Adjust each timeline block
        timelineBlocks.forEach(block => {
            // Make blocks vertical (circle on top, content below)
            block.style.flexDirection = 'column';
            block.style.alignItems = 'center';
            block.style.paddingTop = '1.875rem';
            block.style.marginBottom = '2.5rem';
            
            // Adjust date marker positioning
            const dateMarker = block.querySelector('.timeline-date-marker');
            if (dateMarker) {
                dateMarker.style.position = 'relative';
                dateMarker.style.top = '0';
                dateMarker.style.left = '0';
                dateMarker.style.transform = 'none';
                dateMarker.style.marginBottom = '1rem';
            }
            
            // Adjust content positioning and width
            const content = block.querySelector('.timeline-content');
            if (content) {
                content.style.width = '90%';
                content.style.marginTop = '0';
                content.style.marginLeft = 'auto';
                content.style.marginRight = 'auto';
                
                // Remove the arrow
                if (content.querySelector('::before')) {
                    content.querySelector('::before').style.display = 'none';
                }
            }
        });
        
        logTablet('Timeline adjusted to mobile-like vertical layout');
    }
    
    /**
     * Handle device orientation changes
     */
    function handleOrientationChange() {
        logTablet('Orientation changed', 'event');
        
        // Use a small delay to ensure measurements are accurate after rotation
        setTimeout(() => {
            // Reset initialization to force re-initialization with new orientation
            isTabletJSInitialized = false;
            initTabletBehaviors();
        }, 300);
    }
    
    // Initialize tablet behaviors when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTabletBehaviors);
    } else {
        initTabletBehaviors();
    }
    
    // Re-initialize on window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            logTablet('Window resized, reinitializing', 'event');
            isTabletJSInitialized = false;
            initTabletBehaviors();
        }, 250);
    });
    
    // Export for potential external calls
    window.tabletJS = {
        init: initTabletBehaviors,
        adjustNavbar: adjustNavbar,
        equalizeProjectCards: equalizeProjectCardHeights,
        adjustTimeline: adjustTimelineForTablet,
        adjustHamburger: adjustHamburgerButton,
        getStats: () => logStats
    };
})();