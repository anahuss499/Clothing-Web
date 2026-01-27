const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many subscription requests, please try again later.'
});

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Store subscribers (in production, use a database)
const subscribers = new Set();

// Newsletter subscription endpoint
app.post('/api/subscribe', limiter, async (req, res) => {
    const { email } = req.body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Please provide a valid email address.' 
        });
    }

    // Check if already subscribed
    if (subscribers.has(email.toLowerCase())) {
        return res.status(400).json({ 
            success: false, 
            message: 'This email is already subscribed to our newsletter.' 
        });
    }

    try {
        // Add to subscribers list
        subscribers.add(email.toLowerCase());

        // Send welcome email
        const msg = {
            to: email,
            from: {
                email: process.env.SENDER_EMAIL,
                name: 'The Believers'
            },
            subject: 'Welcome to The Believers Newsletter! 🎉',
            text: `Thank you for subscribing to The Believers newsletter!\n\nYou'll now receive:\n✓ Exclusive deals and discounts\n✓ New arrival notifications\n✓ Style tips and inspiration\n✓ Special offers for subscribers\n\nWe're excited to have you as part of our community!\n\nBest regards,\nThe Believers Team\n\nTo unsubscribe, reply to this email with "UNSUBSCRIBE" in the subject line.`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefit-item { padding: 10px 0; border-bottom: 1px solid #eee; }
        .benefit-item:last-child { border-bottom: none; }
        .checkmark { color: #28a745; font-weight: bold; margin-right: 10px; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to The Believers!</h1>
            <p>Where faith meets comfort</p>
        </div>
        <div class="content">
            <h2>Thank you for subscribing! 🎉</h2>
            <p>We're thrilled to have you join our community of believers in modest fashion.</p>
            
            <div class="benefits">
                <h3>As a subscriber, you'll receive:</h3>
                <div class="benefit-item">
                    <span class="checkmark">✓</span>Exclusive deals and discounts
                </div>
                <div class="benefit-item">
                    <span class="checkmark">✓</span>New arrival notifications
                </div>
                <div class="benefit-item">
                    <span class="checkmark">✓</span>Style tips and inspiration
                </div>
                <div class="benefit-item">
                    <span class="checkmark">✓</span>Special offers for subscribers only
                </div>
            </div>

            <p>Get ready for an exciting journey of modest fashion and bold design!</p>
            
            <center>
                <a href="${process.env.WEBSITE_URL || 'http://localhost:8080'}" class="btn">Start Shopping</a>
            </center>
        </div>
        <div class="footer">
            <p>© 2026 The Believers. All rights reserved.</p>
            <p>To unsubscribe, reply to this email with "UNSUBSCRIBE" in the subject line.</p>
        </div>
    </div>
</body>
</html>
            `,
            trackingSettings: {
                clickTracking: { enable: false },
                openTracking: { enable: false }
            },
            mailSettings: {
                bypassListManagement: { enable: false }
            }
        };

        await sgMail.send(msg);

        // Log subscription (in production, save to database)
        console.log(`New subscriber: ${email} at ${new Date().toISOString()}`);

        res.json({ 
            success: true, 
            message: 'Successfully subscribed! Check your inbox for a welcome email.' 
        });

    } catch (error) {
        console.error('SendGrid Error:', error.response?.body || error.message);
        
        // Remove from subscribers if email failed
        subscribers.delete(email.toLowerCase());

        res.status(500).json({ 
            success: false, 
            message: 'Failed to subscribe. Please try again later.' 
        });
    }
});

// Send promotional email to all subscribers
app.post('/api/send-newsletter', async (req, res) => {
    const { subject, message, htmlContent, adminKey } = req.body;

    // Simple admin authentication (in production, use proper auth)
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!subject || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'Subject and message are required.' 
        });
    }

    try {
        const emailPromises = Array.from(subscribers).map(email => {
            const msg = {
                to: email,
                from: {
                    email: process.env.SENDER_EMAIL,
                    name: 'The Believers'
                },
                subject: subject,
                text: message,
                html: htmlContent || message.replace(/\n/g, '<br>'),
                trackingSettings: {
                    clickTracking: { enable: false },
                    openTracking: { enable: false }
                }
            };
            return sgMail.send(msg);
        });

        await Promise.all(emailPromises);

        res.json({ 
            success: true, 
            message: `Newsletter sent to ${subscribers.size} subscribers.` 
        });

    } catch (error) {
        console.error('Newsletter sending error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send newsletter.' 
        });
    }
});

// Get subscriber count (admin only)
app.get('/api/subscriber-count', (req, res) => {
    res.json({ count: subscribers.size });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📧 Email service ready`);
    console.log(`🔒 Rate limiting enabled`);
});
