/**
 * Contact Form Handler for Abhijeet's Portfolio Website
 * Handles form submission and provides logging capabilities
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initContactForm();
    
    // Setup logger for debugging
    setupLogger();
    
    console.log("Contact form handler initialized");
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        console.log("Found contact form, setting up event listeners");
        
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
            
            // Prepare form data
            const formData = {
                from_name: name,
                from_email: email,
                message: message
            };
            
            console.log("Form data prepared:", formData);
            
            // Determine if we should use EmailJS or simulate a submission
            if (typeof emailjs !== 'undefined' && emailjs.init && emailjs.send) {
                // Use EmailJS for real submission
                sendWithEmailJS(formData, submitBtn, formStatus);
            } else {
                // Simulate submission for testing/development
                simulateFormSubmission(formData, submitBtn, formStatus);
            }
        });
    } else {
        console.warn("Contact form not found in the document");
    }
}

/**
 * Send form data using EmailJS
 * @param {Object} formData - The form data to send
 * @param {HTMLElement} submitBtn - The submit button element
 * @param {HTMLElement} formStatus - The form status element
 */
function sendWithEmailJS(formData, submitBtn, formStatus) {
    // EmailJS configuration - replace with your actual IDs
    const serviceID = "service_id";
    const templateID = "template_contact";
    const userID = "a6ZeuYQxMwfD9FtGg";
    
    console.log("Sending form data using EmailJS");
    
    // First check if EmailJS is initialized
    if (!window.emailjsInitialized) {
        try {
            emailjs.init(userID);
            window.emailjsInitialized = true;
            console.log("EmailJS initialized");
        } catch (error) {
            console.error("Failed to initialize EmailJS:", error);
            showError(submitBtn, formStatus, "Failed to initialize email service. Please try again later.");
            return;
        }
    }
    
    // Send the email
    emailjs.send(serviceID, templateID, formData)
        .then(function(response) {
            console.log("SUCCESS!", response.status, response.text);
            formStatus.textContent = 'Your message has been sent successfully!';
            formStatus.className = 'form-status success';
            document.getElementById('contact-form').reset();
            resetSubmitButton(submitBtn);
        })
        .catch(function(error) {
            console.error("FAILED...", error);
            showError(submitBtn, formStatus, "Failed to send message. Please try again later.");
        });
}

/**
 * Simulate form submission for development/testing
 * @param {Object} formData - The form data to send
 * @param {HTMLElement} submitBtn - The submit button element
 * @param {HTMLElement} formStatus - The form status element
 */
function simulateFormSubmission(formData, submitBtn, formStatus) {
    console.log("Simulating form submission...");
    
    // Simulate server request with timeout
    setTimeout(() => {
        // Log the data that would be sent
        console.log("Form would be submitted with data:", JSON.stringify(formData, null, 2));
        
        // Simulate success
        formStatus.textContent = 'Your message has been sent successfully! (Simulated)';
        formStatus.className = 'form-status success';
        
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Reset submit button
        resetSubmitButton(submitBtn);
        
        console.log("Form submission simulation completed successfully");
    }, 1500); // 1.5 seconds delay to simulate server processing
}

/**
 * Reset submit button to normal state
 * @param {HTMLElement} submitBtn - The submit button to reset
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

/**
 * Show error message and reset button
 * @param {HTMLElement} submitBtn - The submit button
 * @param {HTMLElement} formStatus - The form status element
 * @param {string} message - The error message to display
 */
function showError(submitBtn, formStatus, message) {
    formStatus.textContent = message;
    formStatus.className = 'form-status error';
    resetSubmitButton(submitBtn);
}

/**
 * Setup logger for debugging
 */
function setupLogger() {
    // Create a log array for contact form events
    const contactFormLogs = [];
    
    // Store original console methods if not already overridden
    if (!window.originalConsoleLog) {
        window.originalConsoleLog = console.log;
        window.originalConsoleError = console.error;
        window.originalConsoleWarn = console.warn;
    }
    
    // Override console.log to also save to our log array
    console.log = function() {
        const args = Array.from(arguments);
        let message;
        
        // Try to format objects as JSON
        try {
            message = args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    return JSON.stringify(arg);
                }
                return String(arg);
            }).join(' ');
        } catch (e) {
            message = args.join(' ');
        }
        
        const timestamp = new Date().toISOString();
        
        // Add to contact form logs with timestamp
        contactFormLogs.push(`[${timestamp}] [LOG] ${message}`);
        
        // Trim logs if too long
        if (contactFormLogs.length > 1000) {
            contactFormLogs.splice(0, contactFormLogs.length - 500);
        }
        
        // Call original console.log
        window.originalConsoleLog.apply(console, arguments);
    };
    
    // Override console.error
    console.error = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        const timestamp = new Date().toISOString();
        
        // Add to contact form logs with timestamp
        contactFormLogs.push(`[${timestamp}] [ERROR] ${message}`);
        
        // Call original console.error
        window.originalConsoleError.apply(console, arguments);
    };
    
    // Override console.warn
    console.warn = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        const timestamp = new Date().toISOString();
        
        // Add to contact form logs with timestamp
        contactFormLogs.push(`[${timestamp}] [WARN] ${message}`);
        
        // Call original console.warn
        window.originalConsoleWarn.apply(console, arguments);
    };
    
    // Add function to download logs
    window.downloadContactFormLogs = function() {
        const logText = contactFormLogs.join('\n');
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contact-form-logs.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("Contact form logs downloaded");
    };
    
    // Add debug button if in development environment
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Download Form Logs';
        debugBtn.style.position = 'fixed';
        debugBtn.style.bottom = '10px';
        debugBtn.style.left = '10px';
        debugBtn.style.zIndex = '9999';
        debugBtn.style.fontSize = '12px';
        debugBtn.style.padding = '5px 10px';
        debugBtn.style.background = '#333';
        debugBtn.style.color = '#fff';
        debugBtn.style.border = 'none';
        debugBtn.style.borderRadius = '4px';
        debugBtn.style.cursor = 'pointer';
        debugBtn.style.opacity = '0.6';
        
        debugBtn.addEventListener('mouseenter', () => {
            debugBtn.style.opacity = '1';
        });
        
        debugBtn.addEventListener('mouseleave', () => {
            debugBtn.style.opacity = '0.6';
        });
        
        debugBtn.addEventListener('click', window.downloadContactFormLogs);
        
        // Append to body after a short delay to ensure DOM is ready
        setTimeout(() => {
            document.body.appendChild(debugBtn);
        }, 1000);
    }
    
    console.log("Contact form logger initialized");
}

// Make functions globally accessible
window.initContactForm = initContactForm;
window.downloadContactFormLogs = window.downloadContactFormLogs || function() {};