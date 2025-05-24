document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // Prepare form data
            const formData = {
                name: name,
                email: email,
                message: message
            };
            
            // Send data using Email.js (you need to include Email.js script and configure it)
            // For this example, we'll simulate a successful submission
            
            // Simulating server request with timeout
            setTimeout(() => {
                // Email.js would be implemented here with your specific configuration
                // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                //     .then(() => {
                //         // Success
                //     })
                //     .catch((error) => {
                //         // Error handling
                //     });
                
                // For demo purposes, show success message
                formStatus.textContent = 'Your message has been sent successfully!';
                formStatus.className = 'form-status success';
                
                // Reset form
                contactForm.reset();
                
                // Hide loading state
                submitBtn.classList.remove('loading');
            }, 1500);
            
            // Real implementation with Email.js
            /*
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(function() {
                    formStatus.textContent = 'Your message has been sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    submitBtn.classList.remove('loading');
                }, function(error) {
                    formStatus.textContent = 'Failed to send message. Please try again later.';
                    formStatus.className = 'form-status error';
                    console.error('Email.js error:', error);
                    submitBtn.classList.remove('loading');
                });
            */
        });
    }
});

/**
 * Contact Form Handler using EmailJS
 * Add this to a new file js/contact-form.js
 */

// Email.js configuration
const EMAILJS_USER_ID = "YOUR_USER_ID"; // Replace with your actual User ID
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Replace with your actual Service ID
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Replace with your actual Template ID

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_USER_ID);
    } else {
        console.error("EmailJS not loaded!");
    }
    
    // Contact form submission handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields';
                formStatus.className = 'form-status error';
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Please enter a valid email address';
                formStatus.className = 'form-status error';
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.classList.add('loading');
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // Prepare form data
            const formData = {
                from_name: name,
                from_email: email,
                message: message
            };
            
            // Log to console for debugging
            console.log('Sending form data:', formData);
            
            // Check if EmailJS is available
            if (typeof emailjs !== 'undefined') {
                // Send using EmailJS
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        formStatus.textContent = 'Your message has been sent successfully!';
                        formStatus.className = 'form-status success';
                        contactForm.reset();
                    }, function(error) {
                        console.error('FAILED...', error);
                        formStatus.textContent = 'Failed to send message. Please try again later.';
                        formStatus.className = 'form-status error';
                    })
                    .finally(function() {
                        submitBtn.classList.remove('loading');
                    });
            } else {
                // Fallback for development/testing
                console.log('EmailJS not available, simulating success');
                
                // Simulate server request with timeout
                setTimeout(() => {
                    formStatus.textContent = 'Your message has been sent successfully! (Simulated)';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                    submitBtn.classList.remove('loading');
                }, 1500);
            }
        });
    }
    
    // Add log file creation
    function setupLogger() {
        // Create a custom console logger that saves to a log file
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        const originalConsoleInfo = console.info;
        
        const logEntries = [];
        
        // Override console methods
        console.log = function() {
            const args = Array.from(arguments);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logEntries.push(`[LOG] [${new Date().toISOString()}] ${message}`);
            originalConsoleLog.apply(console, arguments);
        };
        
        console.error = function() {
            const args = Array.from(arguments);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logEntries.push(`[ERROR] [${new Date().toISOString()}] ${message}`);
            originalConsoleError.apply(console, arguments);
        };
        
        console.warn = function() {
            const args = Array.from(arguments);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logEntries.push(`[WARN] [${new Date().toISOString()}] ${message}`);
            originalConsoleWarn.apply(console, arguments);
        };
        
        console.info = function() {
            const args = Array.from(arguments);
            const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logEntries.push(`[INFO] [${new Date().toISOString()}] ${message}`);
            originalConsoleInfo.apply(console, arguments);
        };
        
        // Add download log function to window
        window.downloadLog = function() {
            const logContent = logEntries.join('\n');
            const blob = new Blob([logContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `contact-form-log-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        
        // Add a small download log button
        const logBtn = document.createElement('button');
        logBtn.textContent = 'Download Log';
        logBtn.style.position = 'fixed';
        logBtn.style.bottom = '10px';
        logBtn.style.right = '10px';
        logBtn.style.fontSize = '12px';
        logBtn.style.padding = '5px 10px';
        logBtn.style.background = '#333';
        logBtn.style.color = '#fff';
        logBtn.style.border = 'none';
        logBtn.style.borderRadius = '3px';
        logBtn.style.cursor = 'pointer';
        logBtn.style.zIndex = '9999';
        logBtn.style.opacity = '0.5';
        logBtn.style.transition = 'opacity 0.3s';
        
        logBtn.addEventListener('mouseenter', () => {
            logBtn.style.opacity = '1';
        });
        
        logBtn.addEventListener('mouseleave', () => {
            logBtn.style.opacity = '0.5';
        });
        
        logBtn.addEventListener('click', window.downloadLog);
        
        // Only add in development mode or with a special flag
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.enableLogs) {
            document.body.appendChild(logBtn);
        }
    }
    
    // Setup logger
    setupLogger();
    
    // Log initial information
    console.log('Contact form handler initialized');
    console.log('Browser information:', navigator.userAgent);
    console.log('Screen resolution:', window.innerWidth, 'x', window.innerHeight);
});