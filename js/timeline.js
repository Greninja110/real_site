/**
 * Timeline JavaScript for Abhijeet's Portfolio Website
 * Handles timeline functionality and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Timeline.js loaded successfully");
    
    // Initialize timeline functionality
    initTimeline();
    
    // Set up logging
    setupTimelineLogger();
});

/**
 * Initialize timeline functionality
 */
function initTimeline() {
    const yearMarkers = document.querySelectorAll('.timeline-year-marker');
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    
    console.log(`Found ${yearMarkers.length} year markers and ${timelineBlocks.length} timeline blocks`);
    
    // Year marker navigation
    if (yearMarkers.length > 0) {
        yearMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                console.log(`Timeline year marker clicked: ${year}`);
                
                // Remove active class from all markers
                yearMarkers.forEach(m => m.classList.remove('active'));
                
                // Add active class to clicked marker
                this.classList.add('active');
                
                // Scroll to the corresponding year section
                const yearSection = document.getElementById(`timeline-year-${year}`);
                if (yearSection) {
                    yearSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Activate first marker by default if none is active
        if (!document.querySelector('.timeline-year-marker.active')) {
            yearMarkers[0].classList.add('active');
        }
    }
    
    // Timeline block visibility
    if (timelineBlocks.length > 0) {
        // Initially hide blocks below the fold
        hideBlocks(timelineBlocks);
        
        // Show blocks on scroll
        window.addEventListener('scroll', function() {
            showBlocks(timelineBlocks);
        });
    }
    
    console.log("Timeline functionality initialized");
}

/**
 * Hide timeline blocks below the fold
 */
function hideBlocks(blocks) {
    blocks.forEach(function(block) {
        // Check if block is below the fold
        if (block.getBoundingClientRect().top > window.innerHeight * 0.8) {
            block.classList.remove('visible');
        } else {
            block.classList.add('visible');
        }
    });
}

/**
 * Show timeline blocks as they enter the viewport
 */
function showBlocks(blocks) {
    blocks.forEach(function(block) {
        if (!block.classList.contains('visible') && 
            block.getBoundingClientRect().top <= window.innerHeight * 0.8) {
            block.classList.add('visible');
        }
    });
}

/**
 * Set up logger for timeline
 */
function setupTimelineLogger() {
    console.log("Timeline logger initialized");
    
    // Create log array for timeline events
    window.timelineLogs = [];
    
    // Add log function
    window.logTimelineEvent = function(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${message}`;
        
        // Add to log array
        window.timelineLogs.push(logEntry);
        
        // Log to console
        console.log(`[Timeline] ${message}`);
    };
}

// Make functions globally accessible
window.initTimeline = initTimeline;