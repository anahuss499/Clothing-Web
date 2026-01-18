// Newsletter Subscription API
// This file handles newsletter subscription logic with email validation

class NewsletterService {
    constructor() {
        this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000/api'
            : '/api';
    }

    async subscribe(email) {
        try {
            const response = await fetch(`${this.apiUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Subscription error:', error);
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.'
            };
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, isSuccess) {
        // Create a toast notification
        const toast = document.createElement('div');
        toast.className = `newsletter-toast ${isSuccess ? 'success' : 'error'}`;
        toast.textContent = message;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${isSuccess ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-family: Arial, sans-serif;
            max-width: 350px;
        `;

        document.body.appendChild(toast);

        // Remove after 5 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .newsletter-form input[type="email"] {
        transition: border-color 0.3s;
    }

    .newsletter-form input[type="email"]:focus {
        border-color: #667eea;
        outline: none;
    }

    .newsletter-form button {
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .newsletter-form button:hover {
        opacity: 0.9;
    }

    .newsletter-form button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Initialize the newsletter service
const newsletterService = new NewsletterService();

// Handle newsletter form submissions
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            // Validate email
            if (!newsletterService.validateEmail(email)) {
                newsletterService.showMessage('Please enter a valid email address.', false);
                return;
            }

            // Disable button during submission
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';

            // Subscribe
            const result = await newsletterService.subscribe(email);

            // Show result message
            newsletterService.showMessage(result.message, result.success);

            // Reset form if successful
            if (result.success) {
                emailInput.value = '';
            }

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
});
