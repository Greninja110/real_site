/**
 * Contact Form JavaScript for Abhijeet's Portfolio Website
 * Handles form submission and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Contact.js loaded successfully");
    
    // Initialize contact form
    initContactForm();
    
    // Set up logging
    setupContactLogger();
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        console.log("Contact form found, setting up event listeners");
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Form submission initiated");
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields';
                formStatus.className = 'form-status error';
                console.error("Form validation failed: Missing fields");
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Please enter a valid email address';
                formStatus.className = 'form-status error';
                console.error("Form validation failed: Invalid email format");
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            const submitText = submitBtn.querySelector('.submit-text');
            const submitLoader = submitBtn.querySelector('.submit-loader');
            
            if (submitText && submitLoader) {
                submitText.style.display = 'none';
                submitLoader.style.display = 'inline-block';
            }
            
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // Simulate form submission (since we have Firebase errors)
            console.log("Simulating form submission with data:", { name, email, message });
            
            // Show success message after delay (simulating server response)
            setTimeout(() => {
                formStatus.textContent = 'Your message has been sent successfully! (Simulated)';
                formStatus.className = 'form-status success';
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitBtn.classList.remove('loading');
                if (submitText && submitLoader) {
                    submitText.style.display = 'inline-block';
                    submitLoader.style.display = 'none';
                }
                
                console.log("Form submission simulation completed successfully");
            }, 1500);
        });
    } else {
        console.warn("Contact form not found in the document");
    }
}

/**
 * Set up logger for contact form
 */
function setupContactLogger() {
    console.log("Contact form logger initialized");
    
    // Create log array for contact form events
    window.contactLogs = [];
    
    // Add log function
    window.logContactEvent = function(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} - ${message}`;
        
        // Add to log array
        window.contactLogs.push(logEntry);
        
        // Log to console
        console.log(`[Contact] ${message}`);
    };
}

// Make functions globally accessible
window.initContactForm = initContactForm;