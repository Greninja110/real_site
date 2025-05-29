/**
 * Mobile Navigation JavaScript for Abhijeet's Portfolio Website
 * Handles enhanced mobile menu and single page mode transitions
 */

// Global references for the .last-updated element and its original context
let lastUpdatedElement = null;
let originalLastUpdatedParent = null; 
let mainContentElement = null;

document.addEventListener('DOMContentLoaded', function () {
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
    }
});

window.preserveLayoutAfterThemeChange = function(previousState) {
    console.log("Preserving layout after theme change. Previous state:", previousState);
    const body = document.body;

    if (previousState?.isSinglePageMode && !body.classList.contains('single-page-mode')) {
        body.classList.add('single-page-mode');
    } else if (!previousState?.isSinglePageMode && body.classList.contains('single-page-mode') && window.innerWidth > 767) {
        body.classList.remove('single-page-mode');
    }

    handleDeviceLayout(); 
    
    if (previousState?.activeSection) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === previousState.activeSection);
        });

        if (!body.classList.contains('single-page-mode')) { 
            document.querySelectorAll('.section').forEach(s => {
                const isActive = s.id === previousState.activeSection;
                s.classList.toggle('active', isActive);
                s.style.display = isActive ? 'block' : 'none';
                s.style.opacity = isActive ? '1' : '0';
            });
        } else { 
             const targetSection = document.getElementById(previousState.activeSection);
             if (targetSection) {
                setTimeout(() => { 
                    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                    const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({ top: sectionTop, behavior: 'auto' }); 
                }, 0);
             }
        }
    }
    console.log("Layout preserved/re-applied after theme change.");
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
            const wasInSinglePageMode = body.classList.contains('single-page-mode');
            body.classList.toggle('single-page-mode');
            console.log(`Toggled single-page mode via hamburger. Now: ${body.classList.contains('single-page-mode')}`);
            
            if (wasInSinglePageMode && !body.classList.contains('single-page-mode')) {
                const sections = document.querySelectorAll('.section:not(#stats)');
                let maxVisibleSection = null;
                let maxVisibleAmount = 0;
                const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;

                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const visibleTop = Math.max(0, rect.top - headerHeight);
                    const visibleBottom = Math.min(window.innerHeight - headerHeight, rect.bottom - headerHeight);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                    if (visibleHeight > maxVisibleAmount) {
                        maxVisibleAmount = visibleHeight;
                        maxVisibleSection = section;
                    }
                });
                
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                if (maxVisibleSection) {
                    maxVisibleSection.classList.add('active');
                } else { 
                    const homeSection = document.getElementById('home');
                    if (homeSection) homeSection.classList.add('active');
                }
            }
            
            handleDeviceLayout(); 

            if (body.classList.contains('single-page-mode')) {
                const activeNavLink = document.querySelector('.nav-link.active');
                const activeSectionId = activeNavLink ? activeNavLink.getAttribute('data-section') : 'home';
                const targetSection = document.getElementById(activeSectionId);
                if (targetSection) {
                    setTimeout(() => {
                        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;
                        const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        window.scrollTo({ top: sectionTop, behavior: 'smooth' });
                    }, 100);
                }
                setupIntersectionObserver();
            } else { 
                removeIntersectionObserver();
                const activeSection = document.querySelector('.section.active');
                if(activeSection) history.replaceState(null, null, `#${activeSection.id}`);
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
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
        !lastUpdatedElement || !mainContentElement ) {
        console.error("One or more critical layout elements are missing. Aborting handleDeviceLayout.");
        return;
    }
    
    [sidebar, content, sidebarFooter, sidebarHeader, sidebarNav, mainProfilePicContainer, mainSidebarTitle, hamburgerButton, lastUpdatedElement].forEach(el => {
        if (el) el.style.cssText = '';
    });
    if(mobileThemeToggleInHeader) mobileThemeToggleInHeader.style.cssText = '';
    if(desktopThemeToggleInFooter) desktopThemeToggleInFooter.style.cssText = '';
    if(sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.cssText = '';

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
        if(sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.flexDirection = 'column';

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
            }
            
            sidebarNav.style.display = 'flex';
            sidebarNav.style.visibility = 'visible';
            sidebarNav.style.opacity = '1';
            sidebarNav.style.flexGrow = '1'; 
            sidebarNav.style.height = '100%';
            sidebarNav.style.alignItems = 'center';
            sidebarNav.style.justifyContent = 'flex-start'; 
            sidebarNav.style.padding = '0';
            sidebarNav.style.margin = '0'; 
            sidebarNav.style.order = '4';
            if(sidebarNav.querySelector('ul')) {
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
            content.style.paddingBottom = `1rem`; 
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
            if(sidebarNav.querySelector('ul')) sidebarNav.querySelector('ul').style.flexDirection = 'column';

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

            const activeSection = document.querySelector('.section.active') || document.getElementById('home');
            document.querySelectorAll('.section').forEach(section => {
                const isActive = section === activeSection;
                section.style.display = isActive ? 'block' : 'none';
                section.style.opacity = isActive ? '1' : '0';
                section.classList.toggle('active', isActive);
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
                width: 100%; padding: 20px 15px; font-size: 0.9rem; text-align: center;
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
function setupIntersectionObserver() {
    if (observer) removeIntersectionObserver(); 
    const body = document.body;
    if (!body.classList.contains('single-page-mode')) return; 

    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 60;

    observer = new IntersectionObserver((entries) => {
        if (!body.classList.contains('single-page-mode')) return; 
        
        let mostVisibleEntry = null;
        let maxRatio = -1; 

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    mostVisibleEntry = entry;
                }
            }
        });
        
        if (!mostVisibleEntry) {
            mostVisibleEntry = entries.find(entry => entry.isIntersecting);
        }
        
        if (!mostVisibleEntry) {
            let closestEntry = null;
            let minDistance = Infinity;
            entries.forEach(entry => {
                const distanceToViewportTop = Math.abs(entry.boundingClientRect.top - headerHeight);
                if (distanceToViewportTop < minDistance) {
                    minDistance = distanceToViewportTop;
                    closestEntry = entry;
                }
            });
            mostVisibleEntry = closestEntry;
        }

        if (mostVisibleEntry) {
            const sectionId = mostVisibleEntry.target.id;
            if (sectionId === 'stats') return; 
            
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-section') === sectionId);
            });
            if (history.replaceState && !document.body.classList.contains('scrolling-to-section')) {
                 history.replaceState(null, null, `#${sectionId}`);
            }
        }
    }, {
        threshold: [0.01, 0.1, 0.25, 0.5, 0.75, 0.99], 
        rootMargin: `-${headerHeight + 5}px 0px -45% 0px` 
    });
    document.querySelectorAll('.section:not(#stats)').forEach(section => observer.observe(section));
    console.log("Intersection observer set up for single-page mode.");
}

function removeIntersectionObserver() {
    if (observer) {
        document.querySelectorAll('.section').forEach(section => observer.unobserve(section));
        observer.disconnect(); 
        observer = null;
        console.log("Intersection observer removed.");
    }
}

window.initMobileNav = initMobileNav;
window.handleDeviceLayout = handleDeviceLayout;
window.showAllSections = showAllSections;
window.hideAllSections = hideAllSections;