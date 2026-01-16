this is the er# Google OAuth Setup Instructions

To enable Google Sign-In functionality, you need to configure Google OAuth 2.0 credentials:

## Steps to Configure Google OAuth

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

### 2. Create OAuth 2.0 Credentials
1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Configure the OAuth consent screen:
   - Add app name: "The Believers"
   - Add your domain
   - Add authorized domains
4. Choose **Web application** as the application type
5. Add **Authorized JavaScript origins**:
   - `http://localhost:8000` (for local testing)
   - `http://127.0.0.1:8000` (for local testing)
   - Your production domain (e.g., `https://yourdomain.com`)
6. Add **Authorized redirect URIs**:
   - `http://localhost:8000/login.html`
   - `http://127.0.0.1:8000/login.html`
   - Your production login page URL
7. Click **Create**
8. Copy the **Client ID**

### 3. Update the Code
1. Open `login.js`
2. Find the line:
   ```javascript
   const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
   ```
3. Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID

### 4. Test Locally
1. Run a local web server (don't open HTML files directly):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (if you have http-server installed)
   npx http-server -p 8000
   ```
2. Navigate to `http://localhost:8000/login.html`
3. Test the Google Sign-In button

## Features Implemented

### 1. Login/Signup Page (`login.html`)
- ✅ Email/Password login
- ✅ Email/Password signup with validation
- ✅ Google Sign-In integration
- ✅ Remember Me functionality
- ✅ Form validation
- ✅ Success modal
- ✅ Responsive design

### 2. Men/Women Section Navigation
- ✅ Navigation links in header now work with `onclick="showCategory('men')"`
- ✅ Category cards have functional "Explore" buttons
- ✅ Sidebar navigation links to men/women/kids sections
- ✅ Smooth scrolling to category sections
- ✅ Back to home functionality

### 3. User Session Management
- ✅ User data stored in localStorage
- ✅ Login state persistence
- ✅ User icon changes when logged in
- ✅ User name displayed in header

## How It Works

### Login Flow
1. User clicks the user icon in the header (or navigates to `login.html`)
2. User can choose to:
   - Sign in with existing credentials
   - Create a new account
   - Sign in with Google
3. Upon successful authentication:
   - User data is stored in localStorage
   - Success modal is shown
   - User is redirected to home page
   - Header icon changes to indicate logged-in state

### Category Navigation
1. User clicks on "Men", "Women", or "Kids" in the navigation
2. The `showCategory()` function:
   - Hides main product sections
   - Shows dedicated category section
   - Filters products by category
   - Displays Islamic wear and streetwear separately
   - Smooth scrolls to the section

## Files Created/Modified

### New Files
- `login.html` - Login/Signup page
- `login.css` - Styling for login page
- `login.js` - Authentication logic
- `GOOGLE_OAUTH_SETUP.md` - This documentation

### Modified Files
- `index.html` - Added login button and onclick handlers for category links
- `script.js` - Added user authentication check on page load

## Security Notes

⚠️ **Important**: This implementation stores user data in localStorage, which is suitable for demo purposes but NOT for production use.

For a production application, you should:
1. Use a backend API to handle authentication
2. Store tokens securely (httpOnly cookies)
3. Implement proper session management
4. Use HTTPS for all requests
5. Add CSRF protection
6. Implement rate limiting
7. Add proper password hashing (bcrypt, argon2)
8. Validate all inputs on the server side

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Google Sign-In Not Working
- Ensure you're running the site on a web server (not file://)
- Check that your domain is authorized in Google Cloud Console
- Verify the Client ID is correctly set in `login.js`
- Check browser console for errors

### Categories Not Working
- Ensure JavaScript is enabled
- Check that `script.js` is loaded properly
- Verify the `showCategory()` function is defined
- Check browser console for errors

## Demo Mode
The application includes a demo mode for Google Sign-In that works without setting up OAuth credentials. This is for testing purposes only. To use production Google Sign-In, follow the setup instructions above.
