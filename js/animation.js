/**
 * Animation JavaScript for Abhijeet's Portfolio Website
 * Handles typing animations and other animation effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initTypingAnimation();
});

/**
 * Initialize typing animation in the About/Home section
 */
// Update in js/animation.js - Fix the initTypingAnimation function
// Update in js/animation.js - Fix the initTypingAnimation function
function initTypingAnimation() {
    const animatedText = document.getElementById('animated-text');
    const textContent = document.getElementById('text-content');
    const cursor = document.getElementById('cursor');
    
    // Check if all elements exist before proceeding
    if (!animatedText || !textContent || !cursor) {
        console.log("Animation elements not found, skipping animation");
        return; // Exit the function if elements don't exist
    }
    
    const messages = ["Welcomes You To The Website", "Says Hello"];
    
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // Base typing speed in ms
    
    function type() {
        const currentMessage = messages[messageIndex];
        
        if (isDeleting) {
            // Removing characters
            textContent.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Adding characters
            textContent.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal speed when typing
        }
        
        // If we finished typing the message
        if (!isDeleting && charIndex === currentMessage.length) {
            isDeleting = true;
            typingSpeed = 1000; // Pause at the end of typing
        } 
        // If we deleted the entire message
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length; // Move to next message
            typingSpeed = 500; // Pause before starting to type new message
        }
        
        // Continue the typing animation
        setTimeout(type, typingSpeed);
    }
    
    // Start the typing animation with a delay
    setTimeout(type, 1000); // Delay before starting
}

/**
 * Animate elements when they enter the viewport
 * Uses Intersection Observer API
 */
function initScrollAnimations() {
    // Check if Intersection Observer API is supported
    if ('IntersectionObserver' in window) {
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // Use viewport as root
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Trigger a bit before element enters viewport
        });
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(element => {
            element.classList.add('animated');
        });
    }
}

/**
 * Add subtle parallax effect to elements
 */
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.2;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

/**
 * Initialize skill bars animation
 */
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        
        // Reset width to 0
        bar.style.width = '0';
        
        // Animate to the actual width
        setTimeout(() => {
            bar.style.transition = 'width 1s ease-in-out';
            bar.style.width = width;
        }, 100);
    });
}

/**
 * Initialize animations when a section becomes active
 */
function initSectionAnimations(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        // Animate skill bars in about section
        if (sectionId === 'home') {
            animateSkillBars();
        }
        
        // Initialize scroll animations for the active section
        const elementsToAnimate = section.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(element => {
            element.classList.add('animated');
        });
    }
}

// Make functions accessible globally
window.initScrollAnimations = initScrollAnimations;
window.initParallaxEffect = initParallaxEffect;
window.initSectionAnimations = initSectionAnimations;