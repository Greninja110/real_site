/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

// Global references for the .last-updated element and its original context
let lastUpdatedElement = null;
let originalLastUpdatedParent = null;
let mainContentElement = null;

// Add this function at the top of mobile-nav.js, before any other function
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

/**
 * Synchronize navigation with current URL hash
 * This ensures the correct nav link is highlighted based on the URL
 */
function syncNavigationWithHash() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        // Set active section in localStorage
        localStorage.setItem('activeSectionId', hash);
        console.log(`[MobileNav] Synced active section with URL hash: ${hash}`);

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            const shouldBeActive = link.getAttribute('data-section') === hash;
            link.classList.toggle('active', shouldBeActive);

            if (shouldBeActive) {
                console.log(`[MobileNav] Set nav link for ${hash} active based on URL hash`);
            }
        });
    }
}

function determineInitialLayoutMode() {
    const body = document.body;
    const isMobile = window.innerWidth <= 767;
    let navigationMode = localStorage.getItem('navigationMode');

    if (isMobile) {
        if (!body.classList.contains('single-page-mode')) {
            body.classList.add('single-page-mode');
        }
        // On mobile, we always want single-page layout behavior, so we don't strictly need to set localStorage.
        // Or, if we do, it should be clear it's a mobile-forced state.
    } else { // Desktop
        if (navigationMode === 'singlePage') {
            if (!body.classList.contains('single-page-mode')) {
                body.classList.add('single-page-mode');
            }
        } else if (navigationMode === 'multiPage') {
            if (body.classList.contains('single-page-mode')) {
                body.classList.remove('single-page-mode');
            }
        } else { // Default for desktop: multiPage (left-nav)
            if (body.classList.contains('single-page-mode')) {
                body.classList.remove('single-page-mode');
            }
            localStorage.setItem('navigationMode', 'multiPage'); // Save default for desktop
        }
    }
    console.log(`[MobileNav] Initial layout mode determined. Mobile: ${isMobile}, StoredNavMode: ${navigationMode}, ActualSinglePage: ${body.classList.contains('single-page-mode')}`);

    // Add this section at the end to ensure URL hash is respected
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        localStorage.setItem('activeSectionId', hash);
        console.log(`[MobileNav] Setting active section from URL hash: ${hash}`);

        // If in multi-page mode, make sure the correct section is active
        if (!body.classList.contains('single-page-mode')) {
            setTimeout(() => {
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.toggle('active', section.id === hash);
                    section.style.display = section.id === hash ? 'block' : 'none';
                    section.style.opacity = section.id === hash ? '1' : '0';
                });

                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === hash);
                });
            }, 50);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    determineInitialLayoutMode(); // Call the new function here

    lastUpdatedElement = document.querySelector('.last-updated');
    if (lastUpdatedElement) {
        originalLastUpdatedParent = lastUpdatedElement.parentElement;
    }
    mainContentElement = document.querySelector('main.content');

    initMobileNav();
    window.addEventListener('resize', handleDeviceLayout);

    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('change', function () {
            const currentState = {
                isSinglePageMode: document.body.classList.contains('single-page-mode'),
                sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
                activeSection: document.querySelector('.section.active')?.id ||
                    (document.body.classList.contains('single-page-mode') ?
                        (document.querySelector('.nav-link.active')?.getAttribute('data-section') || 'home') : 'home')
            };
            if (mobileThemeToggle) mobileThemeToggle.checked = themeToggle.checked;
            // applyTheme is called by theme.js, which calls preserveLayoutAfterThemeChange
        });
    }

    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function () {
            const currentState = {
                isSinglePageMode: document.body.classList.contains('single-page-mode'),
                sidebarOpen: document.querySelector('.sidebar')?.classList.contains('open'),
                activeSection: document.querySelector('.section.active')?.id ||
                    (document.body.classList.contains('single-page-mode') ?
                        (document.querySelector('.nav-link.active')?.getAttribute('data-section') || 'home') : 'home')
            };
            if (themeToggle) {
                themeToggle.checked = mobileThemeToggle.checked;
                themeToggle.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                const newTheme = this.checked ? 'light-theme' : 'dark-theme';
                if (typeof window.applyTheme === 'function') window.applyTheme(newTheme);
                if (typeof window.preserveLayoutAfterThemeChange === 'function') {
                    setTimeout(() => window.preserveLayoutAfterThemeChange(currentState), 50);
                }
            }
        });
        setTimeout(syncNavigationWithHash, 300);
    }
});

window.preserveLayoutAfterThemeChange = function (previousState) {
    console.log("[MobileNav] Preserving layout after theme change. Previous state:", previousState);
    const body = document.body;
    const isMobile = window.innerWidth <= 767;

    // Ensure correct single-page-mode class based on previous state and current width
    if (isMobile) {
        if (!body.classList.contains('single-page-mode')) {
            body.classList.add('single-page-mode');
        }
    } else { // Desktop
        if (previousState?.isSinglePageMode && !body.classList.contains('single-page-mode')) {
            body.classList.add('single-page-mode');
        } else if (!previousState?.isSinglePageMode && body.classList.contains('single-page-mode')) {
            // This implies user was in multi-page, theme changed, and somehow single-page got added.
            // Or, previousState was from mobile view.
            // Generally, on desktop, if previous state was NOT single page, it should remain not single page.
            // Unless localStorage overrides.
            const storedNavMode = localStorage.getItem('navigationMode');
            if (storedNavMode === 'multiPage') {
                body.classList.remove('single-page-mode');
            } else if (storedNavMode === 'singlePage') {
                body.classList.add('single-page-mode');
            } else { // Fallback: if it was single page mode and previous state wasn't, remove it.
                if (!previousState?.isSinglePageMode) body.classList.remove('single-page-mode');
            }
        }
    }

    // Re-apply the full layout based on current body classes and width
    if (typeof handleDeviceLayout === 'function') {
        handleDeviceLayout();
    } else {
        console.error("handleDeviceLayout function is not defined!");
    }

    // Restore active section and nav link
    if (previousState?.activeSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === previousState.activeSection);
        });

        if (!body.classList.contains('single-page-mode')) {
            // Multi-page mode: ensure only active section is displayed
            document.querySelectorAll('.section').forEach(s => {
                const isActive = s.id === previousState.activeSection;
                s.classList.toggle('active', isActive);
                s.style.display = isActive ? 'block' : 'none';
                s.style.opacity = isActive ? '1' : '0';
            });
        } else {
            // Single-page mode: scroll to the active section
            const targetSection = document.getElementById(previousState.activeSection);
            // Single-page mode: preserve scroll position rather than jumping to section
            if (targetSection) {
                // Store current scroll position before any changes
                const currentScrollPos = window.pageYOffset;

                // Update active classes without scrolling
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.toggle('active', section.id === previousState.activeSection);
                });

                // Restore the scroll position after a small delay to allow rendering
                setTimeout(() => {
                    window.scrollTo({
                        top: currentScrollPos,
                        behavior: 'auto'
                    });
                    console.log(`[MobileNav] Preserved scroll position at ${currentScrollPos}px after theme change`);
                }, 50);
            }
        }
    } else {
        console.warn("[MobileNav] preserveLayoutAfterThemeChange: No active section in previousState to restore.");
        // Fallback to home if no previous active section
        const homeSectionId = 'home';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === homeSectionId);
        });
        if (!body.classList.contains('single-page-mode')) {
            document.querySelectorAll('.section').forEach(s => s.classList.toggle('active', s.id === homeSectionId));
        }
    }
    console.log("[MobileNav] Layout preserved/re-applied after theme change.");
};

function initMobileNav() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;

    if (!mobileToggle || !sidebar) {
        console.error("Mobile toggle or sidebar not found. Navigation not initialized.");
        return;
    }

    handleDeviceLayout();

    mobileToggle.addEventListener('click', function () {
        if (window.innerWidth <= 767) {
            sidebar.classList.toggle('open');
        } else {
            // Store current section BEFORE toggling mode
            let currentSectionId;

            // First check localStorage for most reliable source
            const storedSectionId = localStorage.getItem('activeSectionId');

            if (storedSectionId && document.getElementById(storedSectionId)) {
                // If we have a valid stored section, use that
                currentSectionId = storedSectionId;
                console.log(`[MobileNav] Using stored section ID for mode toggle: ${currentSectionId}`);
            } else if (body.classList.contains('single-page-mode')) {
                // In single-page mode, get section from active nav link OR intersection observer data
                const activeNavLink = document.querySelector('.nav-link.active');
                if (activeNavLink) {
                    currentSectionId = activeNavLink.getAttribute('data-section');
                    console.log(`[MobileNav] Using active nav link section ID: ${currentSectionId}`);
                } else {
                    // Fallback - get the section currently in view
                    const sections = document.querySelectorAll('.section');
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;

                    let mostVisibleSection = null;
                    let maxVisibility = 0;

                    sections.forEach(section => {
                        const rect = section.getBoundingClientRect();
                        // Check how much of the section is visible in the viewport
                        const visibility = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, headerHeight);
                        if (visibility > maxVisibility) {
                            maxVisibility = visibility;
                            mostVisibleSection = section;
                        }
                    });

                    currentSectionId = mostVisibleSection ? mostVisibleSection.id : 'home';
                    console.log(`[MobileNav] Using most visible section ID: ${currentSectionId}`);
                }
            } else {
                // In multi-page mode, get section from active section element
                const activeSection = document.querySelector('.section.active');
                currentSectionId = activeSection ? activeSection.id : 'home';
                console.log(`[MobileNav] Using active section ID: ${currentSectionId}`);
            }

            // Store this ID for later
            localStorage.setItem('activeSectionId', currentSectionId);

            // Toggle the mode
            body.classList.toggle('single-page-mode');

            // Save the new mode to localStorage
            const newMode = body.classList.contains('single-page-mode') ? 'singlePage' : 'multiPage';
            localStorage.setItem('navigationMode', newMode);

            console.log(`[MobileNav] Toggled mode to ${newMode}. Active section: ${currentSectionId}`);

            // Apply layout changes
            handleDeviceLayout();

            // Ensure correct section activation after layout change
            if (body.classList.contains('single-page-mode')) {
                // Going to single-page mode - make all sections visible
                document.querySelectorAll('.section').forEach(section => {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                });

                // Activate correct nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('data-section') === currentSectionId);
                });

                // Scroll to the target section
                const targetSection = document.getElementById(currentSectionId);
                if (targetSection) {
                    setTimeout(() => {
                        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                        const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                    }, 200);
                }

                setupIntersectionObserver();
            } else {
                // Going to multi-page mode - hide all sections except current
                removeIntersectionObserver();

                // Make sure we really know which section is active
                const targetSectionId = currentSectionId || localStorage.getItem('activeSectionId') || 'home';
                console.log(`[MobileNav] Transitioning to multi-page mode. Target section: ${targetSectionId}`);

                document.querySelectorAll('.section').forEach(section => {
                    const isActive = section.id === targetSectionId;
                    section.classList.toggle('active', isActive);
                    section.style.display = isActive ? 'block' : 'none';
                    section.style.opacity = isActive ? '1' : '0';

                    if (isActive) {
                        console.log(`[MobileNav] Set section ${section.id} as active and visible`);
                    }
                });

                // Activate correct nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    const shouldBeActive = link.getAttribute('data-section') === targetSectionId;
                    link.classList.toggle('active', shouldBeActive);
                    if (shouldBeActive) {
                        console.log(`[MobileNav] Set nav link for ${targetSectionId} as active`);
                    }
                });

                // Update URL hash and localStorage
                localStorage.setItem('activeSectionId', targetSectionId);
                history.replaceState(null, null, `#${targetSectionId}`);
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            // Prevent navigation if modal is being opened
            if (document.body.getAttribute('data-modal-opening') === 'true') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            
            // Also check if modal is currently open
            const modal = document.getElementById('project-modal');
            if (modal && modal.style.display === 'flex') {
                return; // Don't navigate if modal is open
            }
            
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (!targetSection) {
                console.error(`Section ${sectionId} not found!`);
                return;
            }
            document.querySelectorAll('.nav-link').forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');

            if (body.classList.contains('single-page-mode')) {
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                if (window.innerWidth <= 767 && sidebar && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                }
            } else {
                document.querySelectorAll('.section').forEach(s => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                    s.style.opacity = '0';
                });
                targetSection.classList.add('active');
                targetSection.style.display = 'block';
                targetSection.style.opacity = '1';
                history.pushState(null, null, `#${sectionId}`);
            }
        });
    });
    console.log('Navigation initialized');
}

function handleDeviceLayout() {
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    const sidebarFooter = document.querySelector('.sidebar-footer');
    const sidebarHeader = document.querySelector('.sidebar-header');
    const sidebarNav = document.querySelector('.sidebar-nav');
    const mobileThemeToggleInHeader = sidebarHeader ? sidebarHeader.querySelector('.mobile-theme-toggle') : null;
    const desktopThemeToggleInFooter = sidebarFooter ? sidebarFooter.querySelector('#theme-toggle') : null;
    const mainProfilePicContainer = sidebarHeader ? sidebarHeader.querySelector('.profile-pic-container') : null;
    const mainSidebarTitle = sidebarHeader ? sidebarHeader.querySelector('.sidebar-title') : null;
    const hamburgerButton = document.getElementById('mobile-toggle');

    if (!sidebar || !content || !sidebarFooter || !sidebarHeader || !sidebarNav || !hamburgerButton ||
        !lastUpdatedElement || !mainContentElement) {
        console.error("One or more critical layout elements are missing. Aborting handleDeviceLayout.");
        return;
    }

    [sidebar, content, sidebarFooter, sidebarHeader, sidebarNav, mainProfilePicContainer, mainSidebarTitle, hamburgerButton, lastUpdatedElement].forEach(el => {
        if (el) el.style.cssText = '';
    });
    if (mobileThemeToggleInHeader) mobileThemeToggleInHeader.style.cssText = '';
    if (desktopThemeToggleInFooter) desktopThemeToggleInFooter.style.cssText = '';
    if (sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.cssText = '';

    const isMobile = window.innerWidth <= 767;
    const headerHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim() || '60px';
    const sidebarWidthVar = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width-default').trim() || '280px';
    const lightBorderVar = getComputedStyle(document.documentElement).getPropertyValue('--light-border').trim() || '#dee2e6';
    const darkBorderVar = getComputedStyle(document.documentElement).getPropertyValue('--dark-border').trim() || '#334155';
    const lightSidebarBgVar = getComputedStyle(document.documentElement).getPropertyValue('--light-sidebar-bg').trim() || '#ffffff';
    const darkSidebarBgVar = getComputedStyle(document.documentElement).getPropertyValue('--dark-sidebar-bg').trim() || '#1e293b';
    const lightTextVar = getComputedStyle(document.documentElement).getPropertyValue('--light-text').trim() || '#333333';
    const darkTextVar = getComputedStyle(document.documentElement).getPropertyValue('--dark-text').trim() || '#e2e8f0';
    const sectionPaddingValues = getComputedStyle(document.documentElement).getPropertyValue('--section-padding').trim().split(/\s+/);
    const sectionContentPaddingLeft = sectionPaddingValues.length > 1 ? sectionPaddingValues[1] : (sectionPaddingValues[0] || '2rem');


    if (isMobile) {
        if (!body.classList.contains('single-page-mode')) {
            body.classList.add('single-page-mode');
        }
        sidebar.classList.remove('open');

        sidebar.style.width = '100%';
        sidebar.style.height = headerHeightVar;
        sidebar.style.position = 'fixed';
        sidebar.style.top = '0';
        sidebar.style.left = '0';
        sidebar.style.flexDirection = 'column';
        sidebar.style.overflow = 'hidden';
        sidebar.style.borderRight = 'none';
        sidebar.style.borderBottom = `1px solid ${body.classList.contains('light-theme') ? lightBorderVar : darkBorderVar}`;

        sidebarHeader.style.display = 'flex';
        sidebarHeader.style.flexDirection = 'row';
        sidebarHeader.style.alignItems = 'center';
        sidebarHeader.style.width = '100%';
        sidebarHeader.style.height = headerHeightVar;
        sidebarHeader.style.padding = '0 1rem';

        if (hamburgerButton) {
            hamburgerButton.style.display = 'flex';
            hamburgerButton.style.order = '1';
            hamburgerButton.style.marginRight = '10px';
        }
        if (mainProfilePicContainer) {
            mainProfilePicContainer.style.display = 'flex';
            mainProfilePicContainer.style.width = '40px';
            mainProfilePicContainer.style.height = '40px';
            mainProfilePicContainer.style.margin = '0 10px 0 0';
            mainProfilePicContainer.style.order = '2';
        }
        if (mainSidebarTitle) {
            mainSidebarTitle.style.display = 'block';
            mainSidebarTitle.style.fontSize = '1.2rem';
            mainSidebarTitle.style.margin = '0';
            mainSidebarTitle.style.order = '3';
            mainSidebarTitle.style.flexGrow = '1';
            mainSidebarTitle.style.marginRight = 'auto';
        }
        if (mobileThemeToggleInHeader) {
            mobileThemeToggleInHeader.style.display = 'flex';
            mobileThemeToggleInHeader.style.order = '4';
            mobileThemeToggleInHeader.style.marginLeft = '10px';
            mobileThemeToggleInHeader.style.flexShrink = '0';
        }
        if (desktopThemeToggleInFooter) desktopThemeToggleInFooter.style.display = 'none';

        sidebarNav.style.display = 'none';
        sidebarNav.style.width = '100%';
        sidebarNav.style.padding = '1rem';
        sidebarNav.style.marginTop = headerHeightVar;
        sidebarNav.style.height = `calc(100vh - ${headerHeightVar})`;
        sidebarNav.style.overflowY = 'auto';
        if (sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.flexDirection = 'column';

        content.style.marginLeft = '0';
        content.style.width = '100%';
        content.style.paddingTop = `calc(${headerHeightVar} + 1rem)`;
        content.style.paddingBottom = `1rem`;

        sidebarFooter.style.display = 'block';
        sidebarFooter.style.padding = '0';
        sidebarFooter.style.borderTop = 'none';
        sidebarFooter.style.marginTop = '0';

        showAllSections();
        setupIntersectionObserver();
        content.classList.remove('centered-content');

    } else { // Desktop / Tablet
        sidebar.classList.remove('open');

        if (body.classList.contains('single-page-mode')) { // Desktop Top Nav
            sidebar.style.width = '100%';
            sidebar.style.height = headerHeightVar;
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.display = 'flex';
            sidebar.style.flexDirection = 'row';
            sidebar.style.alignItems = 'center';
            sidebar.style.padding = `0 ${sectionContentPaddingLeft}`;
            sidebar.style.borderRight = 'none';
            sidebar.style.borderBottom = `1px solid ${body.classList.contains('light-theme') ? lightBorderVar : darkBorderVar}`;
            sidebar.style.overflow = 'visible';

            sidebarHeader.style.display = 'contents';

            if (hamburgerButton) {
                hamburgerButton.style.display = 'flex';
                hamburgerButton.style.order = '1';
                hamburgerButton.style.marginRight = '15px';
            }
            if (mainProfilePicContainer) {
                mainProfilePicContainer.style.display = 'flex';
                mainProfilePicContainer.style.width = '40px';
                mainProfilePicContainer.style.height = '40px';
                mainProfilePicContainer.style.marginRight = '10px';
                mainProfilePicContainer.style.order = '2';
            }
            if (mainSidebarTitle) {
                mainSidebarTitle.style.display = 'block';
                mainSidebarTitle.style.fontSize = '1.3rem';
                mainSidebarTitle.style.marginRight = '1.5rem'; // Gap after title
                mainSidebarTitle.style.order = '3';
                mainSidebarTitle.style.whiteSpace = 'nowrap';
                // mainSidebarTitle.style.marginLeft = '100px';
            }

            sidebarNav.style.display = 'flex';
            sidebarNav.style.visibility = 'visible';
            sidebarNav.style.opacity = '1';
            sidebarNav.style.flexGrow = '1';
            sidebarNav.style.height = '100%';
            sidebarNav.style.alignItems = 'center';
            sidebarNav.style.justifyContent = 'flex-start';
            sidebarNav.style.paddingTop = '0';
            sidebarNav.style.paddingBottom = '0';
            sidebarNav.style.paddingRight = '0'; // Or some value if needed at the end
            sidebarNav.style.paddingLeft = '1rem'; // << ADD THIS (Adjust '3rem' as needed)
            sidebarNav.style.margin = '0';
            sidebarNav.style.order = '4';
            if (sidebarNav.querySelector('ul')) {
                const ul = sidebarNav.querySelector('ul');
                ul.style.display = 'flex';
                ul.style.flexDirection = 'row';
                ul.style.alignItems = 'center';
                ul.style.justifyContent = 'flex-start';
                ul.style.paddingLeft = '0'; // No extra padding for the ul itself
                ul.style.margin = '0';
                ul.style.listStyle = 'none';
                ul.style.gap = '15px';
            }

            if (mobileThemeToggleInHeader) {
                mobileThemeToggleInHeader.style.display = 'flex';
                mobileThemeToggleInHeader.style.order = '5';
                mobileThemeToggleInHeader.style.marginLeft = 'auto';
                mobileThemeToggleInHeader.style.flexShrink = '0';
            }

            if (desktopThemeToggleInFooter) desktopThemeToggleInFooter.style.display = 'none';
            sidebarFooter.style.display = 'none';

            content.style.marginLeft = '0';
            content.style.width = '100%';
            content.style.paddingTop = `calc(${headerHeightVar} + 2rem)`;
            content.style.paddingBottom = `0.1rem`;
            content.classList.add('centered-content');

            showAllSections();
            setupIntersectionObserver();

        } else { // Desktop Left-Nav Layout (Multi-Page Mode)
            sidebar.style.width = sidebarWidthVar;
            sidebar.style.height = '100vh';
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.display = 'flex';
            sidebar.style.flexDirection = 'column';
            sidebar.style.padding = '0';
            sidebar.style.borderRight = `1px solid ${body.classList.contains('light-theme') ? lightBorderVar : darkBorderVar}`;
            sidebar.style.borderBottom = 'none';
            sidebar.style.overflowY = 'auto';

            sidebarHeader.style.display = 'flex';
            sidebarHeader.style.flexDirection = 'column';
            sidebarHeader.style.alignItems = 'center';
            sidebarHeader.style.padding = '2rem 1rem';

            if (hamburgerButton) {
                hamburgerButton.style.display = 'flex';
                hamburgerButton.style.position = 'absolute';
                hamburgerButton.style.top = '1rem';
                hamburgerButton.style.right = '1rem';
            }
            if (mainProfilePicContainer) {
                mainProfilePicContainer.style.display = 'flex';
                mainProfilePicContainer.style.width = '120px';
                mainProfilePicContainer.style.height = '120px';
                mainProfilePicContainer.style.margin = '1rem 0 1.5rem 0';
            }
            if (mainSidebarTitle) mainSidebarTitle.style.fontSize = '1.5rem';
            if (mobileThemeToggleInHeader) mobileThemeToggleInHeader.style.display = 'none';

            sidebarNav.style.display = 'block';
            sidebarNav.style.flex = '1';
            sidebarNav.style.padding = '0 1.5rem';
            if (sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.flexDirection = 'column';

            content.style.marginLeft = sidebarWidthVar;
            content.style.width = `calc(100% - ${sidebarWidthVar})`;
            content.style.paddingTop = '2rem';
            content.style.paddingBottom = '2rem';
            content.classList.remove('centered-content');

            sidebarFooter.style.display = 'block';
            sidebarFooter.style.padding = '1.5rem';
            sidebarFooter.style.marginTop = 'auto';
            sidebarFooter.style.borderTop = `1px solid ${body.classList.contains('light-theme') ? lightBorderVar : darkBorderVar}`;

            if (desktopThemeToggleInFooter) desktopThemeToggleInFooter.style.display = 'flex';

            if (lastUpdatedElement.parentElement !== sidebarFooter) {
                sidebarFooter.appendChild(lastUpdatedElement);
            }
            lastUpdatedElement.style.cssText = `
                display: flex; align-items: center; justify-content: flex-start; 
                font-size: 0.8rem; padding: 0; opacity: 0.7; /* Removed top padding */
                background-color: transparent; border-top: none; margin-top: 1rem; /* Added margin-top */
                color: ${body.classList.contains('light-theme') ? lightTextVar : darkTextVar};
            `;

            // Get active section from localStorage or fallback to current active section
            const storedSectionId = localStorage.getItem('activeSectionId');
            const activeSection = (storedSectionId && document.getElementById(storedSectionId)) ?
                document.getElementById(storedSectionId) :
                document.querySelector('.section.active') || document.getElementById('home');

            document.querySelectorAll('.section').forEach(section => {
                const isActive = section === activeSection || section.id === storedSectionId;
                section.style.display = isActive ? 'block' : 'none';
                section.style.opacity = isActive ? '1' : '0';
                section.classList.toggle('active', isActive);

                if (isActive) {
                    console.log(`[handleDeviceLayout] Set section ${section.id} as active in multi-page mode`);
                }
            });

            // Make sure nav link is also correct
            document.querySelectorAll('.nav-link').forEach(link => {
                const shouldBeActive = link.getAttribute('data-section') === activeSection.id ||
                    link.getAttribute('data-section') === storedSectionId;
                link.classList.toggle('active', shouldBeActive);

                if (shouldBeActive) {
                    console.log(`[handleDeviceLayout] Set nav link for ${activeSection.id} as active`);
                }
            });

            removeIntersectionObserver();
        }
    }

    // "Last updated" positioning for Mobile and Desktop Top Nav (Single-Page Mode)
    if (isMobile || (window.innerWidth > 767 && body.classList.contains('single-page-mode'))) {
        if (mainContentElement && lastUpdatedElement) {
            if (lastUpdatedElement.parentElement !== mainContentElement) {
                mainContentElement.appendChild(lastUpdatedElement);
            }
            lastUpdatedElement.style.cssText = `
                display: flex; align-items: center; justify-content: center;
                width: 100%; padding: 10px 15px; font-size: 0.9rem; text-align: center;
                margin-top: 3rem; 
                border-top: 1px solid ${body.classList.contains('light-theme') ? lightBorderVar : darkBorderVar};
                background-color: ${body.classList.contains('light-theme') ? lightSidebarBgVar : darkSidebarBgVar};
                color: ${body.classList.contains('light-theme') ? lightTextVar : darkTextVar};
            `;
        }
    }


    window.dispatchEvent(new CustomEvent('layoutChanged', { detail: { isMobile, isSinglePageMode: body.classList.contains('single-page-mode') } }));
    console.log(`Layout handled. Mobile: ${isMobile}, SinglePageMode: ${body.classList.contains('single-page-mode')}`);
}


function showAllSections() {
    document.querySelectorAll('.section').forEach(section => {
        if (section.id !== 'stats') {
            section.style.display = 'block';
            section.style.opacity = '1';
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

let observer;
// Then find the setupIntersectionObserver function and update it:
/* In js/mobile-nav.js - REPLACE the setupIntersectionObserver function with this improved version */
// In js/mobile-nav.js - Replace the setupIntersectionObserver function entirely

function setupIntersectionObserver() {
    if (observer) removeIntersectionObserver();

    const body = document.body;
    if (!body.classList.contains('single-page-mode')) return;

    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;

    // Track state to prevent jitter
    let isScrolling = false;
    let scrollTimeout;
    let currentActiveSectionId = localStorage.getItem('activeSectionId') || 'home';
    let pendingSectionId = null;

    // Debounced section update
    const updateActiveSection = (sectionId) => {
        if (sectionId === currentActiveSectionId || sectionId === 'stats') return;

        currentActiveSectionId = sectionId;

        // Smoothly update nav links
        requestAnimationFrame(() => {
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('data-section') === sectionId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        });

        // Update URL and storage
        history.replaceState(null, null, `#${sectionId}`);
        localStorage.setItem('activeSectionId', sectionId);

        console.log(`[Observer] Section changed to: ${sectionId}`);
    };

    const handleScroll = () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            if (pendingSectionId) {
                updateActiveSection(pendingSectionId);
                pendingSectionId = null;
            }
        }, 150); // Wait for scroll to settle
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observerCallback = (entries) => {
        // Ignore during programmatic scrolling
        if (body.classList.contains('scrolling-to-section')) return;

        // Find the most visible section
        let mostVisibleEntry = null;
        let maxVisibility = 0;

        entries.forEach(entry => {
            if (entry.target.id === 'stats') return;

            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;

            // Calculate visibility percentage
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, headerHeight);
            const visibilityRatio = visibleHeight / rect.height;

            // Section must be at least 30% visible
            if (visibilityRatio > 0.3 && visibilityRatio > maxVisibility) {
                maxVisibility = visibilityRatio;
                mostVisibleEntry = entry;
            }
        });

        if (mostVisibleEntry) {
            const sectionId = mostVisibleEntry.target.id;

            if (isScrolling) {
                // Defer update until scrolling stops
                pendingSectionId = sectionId;
            } else {
                updateActiveSection(sectionId);
            }
        }
    };

    // Create observer with simpler configuration
    observer = new IntersectionObserver(observerCallback, {
        threshold: [0.3, 0.5, 0.7], // Fewer thresholds for stability
        rootMargin: `-${headerHeight}px 0px -20% 0px`
    });

    // Observe all sections except stats
    document.querySelectorAll('.section:not(#stats)').forEach(section => {
        observer.observe(section);
    });

    console.log("[Observer] Enhanced intersection observer setup complete");
}

function removeIntersectionObserver() {
    if (observer) {
        document.querySelectorAll('.section').forEach(section => observer.unobserve(section));
        observer.disconnect();
        observer = null;
        console.log("Intersection observer removed.");
    }
}

// Optimize scroll performance
let rafId = null;
const optimizedScroll = () => {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
        // Trigger any scroll-based updates here
        rafId = null;
    });
};
// Timeline-specific detection fix
function checkTimelineVisibility() {
    if (!document.body.classList.contains('single-page-mode')) return;

    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const headerHeight = 60;

    // Check if any part of timeline is visible
    const isVisible = rect.bottom > headerHeight && rect.top < viewportHeight;

    if (isVisible) {
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, headerHeight);
        const visibilityRatio = visibleHeight / rect.height;

        // If timeline is more than 10% visible, activate it
        if (visibilityRatio > 0.1) {
            const currentActive = document.querySelector('.nav-link.active');
            const timelineNavLink = document.querySelector('.nav-link[data-section="timeline"]');

            if (currentActive && currentActive !== timelineNavLink) {
                // Only update if timeline is significantly visible
                if (visibilityRatio > 0.2 || (rect.top < viewportHeight / 2 && rect.bottom > viewportHeight / 2)) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.toggle('active', link.getAttribute('data-section') === 'timeline');
                    });
                    localStorage.setItem('activeSectionId', 'timeline');
                    history.replaceState(null, null, '#timeline');
                }
            }
        }
    }
}

// Add to scroll event
window.addEventListener('scroll', debounce(checkTimelineVisibility, 50), { passive: true });

window.addEventListener('scroll', optimizedScroll, { passive: true });
window.initMobileNav = initMobileNav;
window.handleDeviceLayout = handleDeviceLayout;
window.showAllSections = showAllSections;
window.hideAllSections = hideAllSections;
window.syncNavigationWithHash = syncNavigationWithHash;