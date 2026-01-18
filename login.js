// Google OAuth Configuration
// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Simple local persistence for demo (use a real backend for production)
const STORAGE_KEYS = {
    accounts: 'accounts',
    user: 'user',
    isLoggedIn: 'isLoggedIn',
    rememberMe: 'rememberMe'
};

const loadAccounts = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts)) || {};
const saveAccounts = (accounts) => localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
const encodePassword = (password) => btoa(password); // Demo-only; do not use in production

function setSession(user, remember) {
    const payload = {
        ...user,
        lastLogin: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(payload));
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, 'true');

    if (remember) {
        localStorage.setItem(STORAGE_KEYS.rememberMe, 'true');
    } else {
        localStorage.removeItem(STORAGE_KEYS.rememberMe);
    }
}

// Initialize Google Sign-In
function initGoogleSignIn() {
    if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleSignIn
        });
    }
}

// Handle Google Sign-In Response
function handleGoogleSignIn(response) {
    // Decode JWT token to get user info
    const userInfo = parseJwt(response.credential);
    
    // Store user data
    const user = {
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        loginMethod: 'google'
    };
    
    setSession(user, true);
    
    // Show success modal
    showSuccessModal(`Welcome, ${user.name}!`);
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toggleLink = document.getElementById('toggleLink');
const toggleText = document.getElementById('toggleText');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.querySelector('.form-subtitle');
const googleSignInBtn = document.getElementById('googleSignInBtn');

// Toggle between login and signup
let isLoginMode = true;

toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    
    if (isLoginMode) {
        // Switch to login
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to continue shopping';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleLink">Sign Up</a>';
    } else {
        // Switch to signup
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join our community today';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleLink">Sign In</a>';
    }
    
    // Re-attach event listener to new toggle link
    document.getElementById('toggleLink').addEventListener('click', arguments.callee);
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const accounts = loadAccounts();
    const account = accounts[email];

    if (!account) {
        alert('Account not found. Please sign up first.');
        return;
    }

    if (account.password !== encodePassword(password)) {
        alert('Incorrect password. Please try again.');
        return;
    }

    const user = {
        email,
        name: account.name,
        loginMethod: 'email'
    };

    setSession(user, rememberMe);
    showSuccessModal(`Welcome back, ${account.name}!`);
});

// Signup Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    if (!agreeTerms) {
        alert('Please agree to the Terms & Conditions');
        return;
    }
    
    const accounts = loadAccounts();

    if (accounts[email]) {
        alert('An account with this email already exists. Please sign in instead.');
        return;
    }

    accounts[email] = {
        name,
        password: encodePassword(password)
    };

    saveAccounts(accounts);

    const user = {
        name,
        email,
        loginMethod: 'email'
    };

    setSession(user, true);
    showSuccessModal(`Welcome to The Believers, ${name}!`);
});

// Google Sign-In Button Click
googleSignInBtn.addEventListener('click', () => {
    // Check if Google Sign-In is loaded
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt(); // Show Google One Tap
    } else {
        // Fallback: Simulate Google Sign-In for demo purposes
        // In production, ensure Google Sign-In library is loaded
        const demoUser = {
            name: 'Demo User',
            email: 'demo@thebelievers.com',
            picture: '',
            loginMethod: 'google'
        };
        
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        showSuccessModal(`Welcome, ${demoUser.name}!`);
    }
});

// Show success modal
function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    successMessage.textContent = message;
    modal.classList.remove('hidden');
}

// Redirect to home page
function redirectToHome() {
    window.location.href = 'index.html';
}

// Check if user is already logged in
window.addEventListener('load', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // Optionally redirect to home if already logged in
            // window.location.href = 'index.html';
        }
    }
    
    // Initialize Google Sign-In
    initGoogleSignIn();
});
