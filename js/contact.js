/**
 * Replace the contents of contact.js with this updated version
 */

document.addEventListener('DOMContentLoaded', function() {
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form data
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields';
                formStatus.className = 'form-status error';
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Please enter a valid email address';
                formStatus.className = 'form-status error';
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
            
            // Simulate form submission (replace with actual email sending later)
            setTimeout(() => {
                // Simulate success
                formStatus.textContent = 'Your message has been sent successfully! I will get back to you soon.';
                formStatus.className = 'form-status success';
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitBtn.classList.remove('loading');
                if (submitText && submitLoader) {
                    submitText.style.display = 'inline-block';
                    submitLoader.style.display = 'none';
                }
            }, 1500);
        });
    }
}

// Make function globally accessible
window.initContactForm = initContactForm;