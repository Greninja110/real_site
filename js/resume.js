/**
 * Resume JavaScript for Abhijeet's Portfolio Website
 * Handles resume tabs and content loading
 */

document.addEventListener('DOMContentLoaded', function () {
    console.log("Resume.js loaded successfully");

    // Initialize resume functionality
    initResume();

    // Set up logging
    setupResumeLogger();
});

/**
 * Initialize resume functionality
 */
function initResume() {
    const resumeTabs = document.querySelectorAll('.resume-tab');
    const resumeContents = document.querySelectorAll('.resume-content');

    console.log(`Found ${resumeTabs.length} resume tabs and ${resumeContents.length} content sections`);

    // Tab switching functionality
    if (resumeTabs.length > 0) {
        resumeTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                const resumeType = this.getAttribute('data-resume');
                console.log(`Resume tab clicked: ${resumeType}`);

                // Remove active class from all tabs
                resumeTabs.forEach(t => t.classList.remove('active'));

                // Add active class to clicked tab
                this.classList.add('active');

                // Hide all resume contents
                resumeContents.forEach(content => {
                    content.classList.remove('active');
                });

                // Show selected resume content
                const targetContent = document.getElementById(`${resumeType}-resume`);
                if (targetContent) {
                    targetContent.classList.add('active');
                } else {
                    console.error(`Resume content with ID ${resumeType}-resume not found!`);
                }
            });
        });
    }

    // Track resume views/downloads
    const viewButtons = document.querySelectorAll('.view-resume-btn');
    const downloadButtons = document.querySelectorAll('.download-resume-btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const resumeType = this.closest('.resume-content').id.replace('-resume', '');
            console.log(`Resume viewed: ${resumeType}`);

            // Track the view if analytics function exists
            if (typeof trackResumeView === 'function') {
                trackResumeView('view');
            }
        });
    });

    downloadButtons.forEach(button => {
        button.addEventListener('click', function () {
            const resumeType = this.closest('.resume-content').id.replace('-resume', '');
            console.log(`Resume downloaded: ${resumeType}`);

            // Track the download if analytics function exists
            if (typeof trackResumeView === 'function') {
                trackResumeView('download');
            }
        });
    });
    // Add at the end of initResume function
    // Hide PDF viewer buttons on mobile
    if (window.innerWidth <= 767) {
        // Add event listener for iframe load
        const resumeIframes = document.querySelectorAll('.resume-preview iframe');
        resumeIframes.forEach(iframe => {
            iframe.addEventListener('load', function () {
                try {
                    // Try to inject CSS to hide buttons in the iframe
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const style = iframeDoc.createElement('style');
                    style.textContent = '.button { display: none !important; }';
                    iframeDoc.head.appendChild(style);
                } catch (e) {
                    console.log('Could not access iframe content - cross-origin restriction');
                }
            });
        });
    }
    console.log("Resume functionality initialized");
}

/**
 * Set up logger for resume
 */
function setupResumeLogger() {
    console.log("Resume logger initialized");

    // Create log array for resume events
    window.resumeLogs = [];

    // Add log function
    window.logResumeEvent = function (message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${message}`;

        // Add to log array
        window.resumeLogs.push(logEntry);

        // Log to console
        console.log(`[Resume] ${message}`);
    };
}

// Make functions globally accessible
window.initResume = initResume;