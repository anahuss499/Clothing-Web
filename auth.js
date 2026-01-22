// Authentication JavaScript

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update active form
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(tabName + 'Form').classList.add('active');
        
        // Clear messages
        clearMessages();
    });
});

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = this.querySelector('.auth-btn');
    
    // Clear previous messages
    clearMessages();
    
    // Disable button
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Migrate localStorage saved items to user account if any exist
            const localSavedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
            if (localSavedItems.length > 0) {
                await migrateSavedItems(data.token, localSavedItems);
            }
            
            // Show success message
            showMessage('loginSuccess', 'Login successful! Redirecting...');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showMessage('loginError', data.message || 'Login failed');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('loginError', 'An error occurred. Please try again.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
});

// Signup Form Handler
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const btn = this.querySelector('.auth-btn');
    
    // Clear previous messages
    clearMessages();
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showMessage('signupError', 'Passwords do not match');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showMessage('signupError', 'Password must be at least 6 characters long');
        return;
    }
    
    // Disable button
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Migrate localStorage saved items to user account if any exist
            const localSavedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
            if (localSavedItems.length > 0) {
                await migrateSavedItems(data.token, localSavedItems);
            }
            
            // Show success message
            showMessage('signupSuccess', 'Account created successfully! Redirecting...');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('signupError', data.message || 'Registration failed');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('signupError', 'An error occurred. Please try again.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
    }
});

// Google Sign-In Button Click
const googleBtn = document.getElementById('googleSignInBtn');
if (googleBtn) {
    googleBtn.addEventListener('click', function() {
        window.location.href = '/auth/google';
    });
}

// Helper function to show messages
function showMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.add('show');
}

// Helper function to clear all messages
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.classList.remove('show');
        msg.textContent = '';
    });
}

// Migrate localStorage saved items to user account
async function migrateSavedItems(token, items) {
    try {
        for (const item of items) {
            await fetch('/api/user/saved-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: item.id,
                    productName: item.name,
                    productPrice: item.price,
                    productImage: item.image,
                    productSize: item.size || 'M'
                })
            });
        }
        
        // Clear localStorage saved items after migration
        localStorage.removeItem('savedItems');
    } catch (error) {
        console.error('Error migrating saved items:', error);
    }
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
});
