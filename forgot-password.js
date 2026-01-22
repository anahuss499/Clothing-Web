// forgot-password.js

document.getElementById('forgotForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const btn = this.querySelector('.forgot-btn');
    const msg = document.getElementById('forgotMessage');
    msg.textContent = '';
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
        const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (data.success) {
            msg.style.color = '#4caf50';
            msg.textContent = 'A password reset link has been sent to your email.';
        } else {
            msg.style.color = '#dc3545';
            msg.textContent = data.message || 'Failed to send reset link.';
        }
    } catch (error) {
        msg.style.color = '#dc3545';
        msg.textContent = 'An error occurred. Please try again.';
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Reset Link';
});
