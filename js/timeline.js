/**
 * Timeline JavaScript for Abhijeet's Portfolio Website
 * Handles timeline animation and scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize timeline functionality once DOM is loaded
    initTimeline();
});

/**
 * Initialize timeline functionality
 */
function initTimeline() {
    // Get all timeline blocks
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    
    // Check if there are any timeline blocks
    if (timelineBlocks.length > 0) {
        // Define the offset value for triggering animations (80% of viewport height)
        const offset = 0.8;
        
        // Hide blocks that are outside the viewport
        hideBlocks(timelineBlocks, offset);
        
        // Listen for scroll events to reveal blocks as they enter the viewport
        window.addEventListener('scroll', function() {
            (!window.requestAnimationFrame) 
                ? setTimeout(function() { showBlocks(timelineBlocks, offset); }, 100)
                : window.requestAnimationFrame(function() { showBlocks(timelineBlocks, offset); });
        });
        
        // Also check on window resize
        window.addEventListener('resize', function() {
            (!window.requestAnimationFrame) 
                ? setTimeout(function() { showBlocks(timelineBlocks, offset); }, 100)
                : window.requestAnimationFrame(function() { showBlocks(timelineBlocks, offset); });
        });
    }

    // Handle timeline navigation if year markers exist
    const yearMarkers = document.querySelectorAll('.timeline-year-marker');
    if (yearMarkers.length > 0) {
        yearMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const year = this.getAttribute('data-year');
                const yearSection = document.getElementById(`timeline-year-${year}`);
                
                if (yearSection) {
                    // Remove active class from all markers
                    yearMarkers.forEach(m => m.classList.remove('active'));
                    
                    // Add active class to clicked marker
                    this.classList.add('active');
                    
                    // Scroll to the year section
                    yearSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

/**
 * Hide timeline blocks that are outside the viewport
 * @param {NodeList} blocks - Timeline blocks to check
 * @param {number} offset - Viewport offset for triggering animations
 */
function hideBlocks(blocks, offset) {
    blocks.forEach(function(block) {
        // Check if block is outside the viewport
        if (block.getBoundingClientRect().top > window.innerHeight * offset) {
            // Initially hide the block - it will be revealed when scrolled into view
            block.classList.remove('visible');
        } else {
            // If block is already in view on page load, make it visible
            block.classList.add('visible');
        }
    });
}

/**
 * Show blocks as they enter the viewport
 * @param {NodeList} blocks - Timeline blocks to check
 * @param {number} offset - Viewport offset for triggering animations
 */
function showBlocks(blocks, offset) {
    blocks.forEach(function(block) {
        // Check if block enters the viewport
        if (!block.classList.contains('visible') && 
            block.getBoundingClientRect().top <= window.innerHeight * offset) {
            // Add visible class to show the block with animation
            block.classList.add('visible');
        }
    });
}

/**
 * Create and add a new timeline entry
 * @param {string} side - Side of the timeline ('left' or 'right')
 * @param {string} date - Date for the entry (e.g., "Jan 2023")
 * @param {string} icon - Icon type ("picture", "movie", or "location")
 * @param {string} title - Entry title
 * @param {string} description - Entry description
 * @param {string} buttonText - Optional button text
 * @param {string} buttonLink - Optional button link
 */
function addTimelineEntry(side, date, icon, title, description, buttonText = null, buttonLink = "#") {
    const timeline = document.querySelector('.timeline');
    
    if (!timeline) {
        console.error('Timeline container not found');
        return;
    }
    
    // Create a new timeline block
    const timelineBlock = document.createElement('div');
    timelineBlock.className = `timeline-block timeline-block-${side}`;
    timelineBlock.setAttribute('data-date', date);
    timelineBlock.setAttribute('data-icon', icon);
    
    // Create timeline content
    let contentHTML = `
        <div class="timeline-content">
            <span class="timeline-date">${date}</span>
            <h3 class="timeline-title">${title}</h3>
            <p class="timeline-description">${description}</p>
    `;
    
    // Add button if specified
    if (buttonText) {
        contentHTML += `<a href="${buttonLink}" class="timeline-btn">${buttonText}</a>`;
    }
    
    contentHTML += `</div>`;
    
    timelineBlock.innerHTML = contentHTML;
    
    // Add the block to the timeline
    timeline.appendChild(timelineBlock);
    
    // Initialize animations
    setTimeout(() => {
        hideBlocks([timelineBlock], 0.8);
        showBlocks([timelineBlock], 0.8);
    }, 100);
}

// Make functions accessible globally
window.addTimelineEntry = addTimelineEntry;
window.initTimeline = initTimeline;