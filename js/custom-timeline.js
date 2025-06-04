/**
 * Custom Timeline JavaScript for Abhijeet's Portfolio
 * Based on vertical-timeline-master but customized for your theme
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom timeline
    initCustomTimeline();
});

/**
 * Initialize the custom timeline
 */
function initCustomTimeline() {
    // Get all timeline blocks
    const timelineBlocks = document.querySelectorAll('.timeline-block');
    
    // Check if there are any timeline blocks
    if (timelineBlocks.length > 0) {
        // Define the offset value - 80% of viewport height
        const offset = 0.8;
        
        // Hide blocks that are outside the viewport on page load
        hideBlocks(timelineBlocks, offset);
        
        // Listen for scroll events to reveal blocks as they enter the viewport
        window.addEventListener('scroll', function() {
            // Use requestAnimationFrame for better performance if available
            if (!window.requestAnimationFrame) {
                setTimeout(function() { 
                    showBlocks(timelineBlocks, offset); 
                }, 100);
            } else {
                window.requestAnimationFrame(function() { 
                    showBlocks(timelineBlocks, offset); 
                });
            }
        });
        
        // Also check on window resize
        window.addEventListener('resize', function() {
            if (!window.requestAnimationFrame) {
                setTimeout(function() { 
                    showBlocks(timelineBlocks, offset); 
                }, 100);
            } else {
                window.requestAnimationFrame(function() { 
                    showBlocks(timelineBlocks, offset); 
                });
            }
        });
    }

    // Handle year marker navigation if they exist
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
                    
                    // Smooth scroll to the year section
                    yearSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Set first marker as active by default if none is active
        if (!document.querySelector('.timeline-year-marker.active')) {
            yearMarkers[0].classList.add('active');
        }
    }
}

/**
 * Hide timeline blocks that are outside the viewport
 * 
 * @param {NodeList} blocks - The timeline blocks to check
 * @param {number} offset - The viewport offset for triggering animations
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
 * 
 * @param {NodeList} blocks - The timeline blocks to check
 * @param {number} offset - The viewport offset for triggering animations
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
 * Add a new timeline entry
 * 
 * @param {string} month - Month for the entry (e.g., "Jan")
 * @param {string} year - Year for the entry (e.g., "2023")
 * @param {string} icon - Icon type ("picture", "movie", or "location")
 * @param {string} title - Entry title
 * @param {string} description - Entry description
 * @param {string} buttonText - Optional button text
 * @param {string} buttonLink - Optional button link
 */
function addTimelineEntry(month, year, icon, title, description, buttonText = null, buttonLink = "#") {
    const timeline = document.querySelector('.timeline');
    
    if (!timeline) {
        console.error('Timeline container not found');
        return;
    }
    
    // Determine which year section to add to, or create new section if needed
    let yearSection = document.getElementById(`timeline-year-${year}`);
    if (!yearSection) {
        // Check if we need to add a new year marker
        const yearMarkerContainer = document.querySelector('.timeline-year-markers');
        if (yearMarkerContainer) {
            const yearExists = Array.from(yearMarkerContainer.querySelectorAll('.timeline-year-marker'))
                .some(marker => marker.getAttribute('data-year') === year);
            
            if (!yearExists) {
                const newMarker = document.createElement('div');
                newMarker.className = 'timeline-year-marker';
                newMarker.setAttribute('data-year', year);
                newMarker.textContent = year;
                yearMarkerContainer.appendChild(newMarker);
                
                // Add click event to new marker
                newMarker.addEventListener('click', function() {
                    const year = this.getAttribute('data-year');
                    const yearSection = document.getElementById(`timeline-year-${year}`);
                    
                    if (yearSection) {
                        // Remove active class from all markers
                        document.querySelectorAll('.timeline-year-marker').forEach(m => m.classList.remove('active'));
                        
                        // Add active class to clicked marker
                        this.classList.add('active');
                        
                        // Smooth scroll to the year section
                        yearSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
        
        // Create a new year section
        yearSection = document.createElement('div');
        yearSection.id = `timeline-year-${year}`;
        yearSection.className = 'timeline-year-section';
        
        // Find the right position to insert the new year section
        const yearSections = Array.from(document.querySelectorAll('.timeline-year-section'));
        if (yearSections.length > 0) {
            let inserted = false;
            for (let i = 0; i < yearSections.length; i++) {
                const sectionYear = yearSections[i].id.replace('timeline-year-', '');
                if (parseInt(year) < parseInt(sectionYear)) {
                    timeline.insertBefore(yearSection, yearSections[i]);
                    inserted = true;
                    break;
                }
            }
            
            if (!inserted) {
                timeline.appendChild(yearSection);
            }
        } else {
            timeline.appendChild(yearSection);
        }
    }
    
    // Create a new timeline block
    const timelineBlock = document.createElement('div');
    timelineBlock.className = 'timeline-block';
    timelineBlock.setAttribute('data-month', month);
    timelineBlock.setAttribute('data-year', year);
    timelineBlock.setAttribute('data-icon', icon);
    
    // Create timeline content with date marker
    let contentHTML = `
        <div class="timeline-date-marker">
            <span class="month">${month}</span>
            <span class="year">${year}</span>
        </div>
        <div class="timeline-content">
            <h3 class="timeline-title">${title}</h3>
            <p class="timeline-description">${description}</p>
    `;
    
    // Add button if specified
    if (buttonText) {
        contentHTML += `<a href="${buttonLink}" class="timeline-btn">${buttonText}</a>`;
    }
    
    contentHTML += `</div>`;
    
    timelineBlock.innerHTML = contentHTML;
    
    // Add the block to the appropriate year section
    yearSection.appendChild(timelineBlock);
    
    // Initialize animations
    setTimeout(() => {
        hideBlocks([timelineBlock], 0.8);
        showBlocks([timelineBlock], 0.8);
    }, 100);
}

// Make functions globally accessible
window.addTimelineEntry = addTimelineEntry;
window.initCustomTimeline = initCustomTimeline;