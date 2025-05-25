/**
 * Contact Form JavaScript for Abhijeet's Portfolio Website
 * Handles form submission and validation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Contact.js loaded successfully");
    
    // Initialize contact form
    initContactForm();
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
            
            // Simulate form submission since real email sending will be implemented later
            simulateFormSubmission(name, email, message, submitBtn, formStatus);
        });
    } else {
        console.warn("Contact form not found in the document");
    }
}

/**
 * Simulate form submission for demonstration purposes
 */
function simulateFormSubmission(name, email, message, submitBtn, formStatus) {
    console.log("Simulating form submission with data:", { name, email, message });
    
    // Simulate server delay
    setTimeout(() => {
        // Show success message
        formStatus.textContent = 'Your message has been sent successfully! I will get back to you soon.';
        formStatus.className = 'form-status success';
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Reset button state
        resetSubmitButton(submitBtn);
        
        console.log("Form submission simulation completed successfully");
    }, 1500);
}

/**
 * Reset submit button to normal state
 */
function resetSubmitButton(submitBtn) {
    submitBtn.classList.remove('loading');
    
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoader = submitBtn.querySelector('.submit-loader');
    
    if (submitText && submitLoader) {
        submitText.style.display = 'inline-block';
        submitLoader.style.display = 'none';
    }
}

// Make functions globally accessible
window.initContactForm = initContactForm;