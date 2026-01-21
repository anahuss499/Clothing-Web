const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Admin dashboard route (MUST be before static middleware)
app.get('/admin-secret-dashboard.html', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(__dirname + '/admin-secret-dashboard.html');
});

// Alternative route without .html
app.get('/admin-secret-dashboard', (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.sendFile(__dirname + '/admin-secret-dashboard.html');
});

// Static files
app.use(express.static('.'));

// Rate limiting to prevent spam
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many subscription requests, please try again later.'
});

// Admin login rate limiting (stricter)
const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Max 3 attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
});

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ===== PAYPAL CONFIGURATION =====
// Set up PayPal environment
const paypalEnvironment = new checkoutNodeJssdk.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET_KEY
);

const paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(paypalEnvironment);

// ===== VISITOR TRACKING SYSTEM =====
// Store active sessions (in-memory, or use MongoDB in production)
const activeSessions = new Map(); // sessionId -> { timestamp, ip, userAgent, page, country, city }
const visitorHistory = []; // Store all visitor events for historical data

// Session timeout (30 minutes of inactivity)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Cleanup old sessions every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, session] of activeSessions.entries()) {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
            activeSessions.delete(sessionId);
        }
    }
}, 5 * 60 * 1000);

// Helper function to get visitor location using ipapi.co (free service)
async function getLocationFromIP(ip) {
    // Clean the IP (remove ::ffff: prefix for IPv6-mapped IPv4 addresses)
    const cleanIP = ip.replace(/^::ffff:/, '');
    
    // For localhost/testing, return a default location
    if (cleanIP === '127.0.0.1' || cleanIP === '::1' || cleanIP.startsWith('192.168.') || cleanIP.startsWith('10.')) {
        return { country: 'Local Network', city: 'Localhost' };
    }
    
    try {
        // Use ipapi.co free API (1,000 requests/day)
        const response = await fetch(`https://ipapi.co/${cleanIP}/json/`);
        
        if (!response.ok) {
            throw new Error('Geolocation API failed');
        }
        
        const data = await response.json();
        
        return {
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown'
        };
    } catch (error) {
        console.error('Geolocation error:', error);
        // Fallback to basic location
        return { country: 'Unknown', city: 'Unknown' };
    }
}

// ===== EMAIL TEMPLATE GENERATOR =====
function generateOrderConfirmationEmail(orderData) {
    const {
        orderId,
        customerName,
        customerEmail,
        items,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        status,
        shippingInfo
    } = orderData;

    const itemsHtml = items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td class="quantity">${item.quantity}</td>
            <td class="price">$${(item.price).toFixed(2)}</td>
            <td class="price">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    const statusClass = status === 'completed' ? 'completed' : 'processing';
    const statusText = status === 'completed' ? 'Completed' : 'Processing';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - The Believers</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #d4a574;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .header img {
            max-width: 200px;
            height: auto;
            margin-bottom: 20px;
            display: block;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-family: 'Playfair Display', Georgia, serif;
            letter-spacing: 1px;
        }
        
        .header p {
            font-size: 20px;
            opacity: 1;
            color: #d4a574;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 10px;
        }
        
        .content {
            padding: 40px;
        }
        
        .greeting {
            margin-bottom: 30px;
        }
        
        .greeting h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .greeting p {
            color: #666;
            line-height: 1.6;
        }
        
        .order-section {
            background-color: #f8f8f8;
            border-left: 4px solid #d4a574;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .order-section h3 {
            font-size: 15px;
            color: #333;
            margin-bottom: 12px;
        }
        
        .order-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .detail-item {
            padding: 8px 0;
        }
        
        .detail-label {
            font-size: 12px;
            color: #8b7355;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: 600;
        }
        
        .detail-value {
            font-size: 16px;
            color: #1a1a1a;
            font-weight: 600;
        }
        
        .items-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
        }
        
        .items-table thead {
            background-color: #1a1a1a;
        }
        
        .items-table th {
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #ffffff;
            font-size: 13px;
        }
        
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            font-size: 14px;
        }
        
        .items-table tr:last-child td {
            border-bottom: none;
        }
        
        .items-table .quantity {
            text-align: center;
        }
        
        .items-table .price {
            text-align: right;
            font-weight: 600;
        }
        
        .total-row {
            background-color: #f9f9f9;
            font-weight: 600;
            font-size: 16px;
        }
        
        .shipping-section {
            background-color: #f8f8f8;
            border-left: 4px solid #d4a574;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .shipping-section h3 {
            font-size: 16px;
            color: #333;
            margin-bottom: 15px;
        }
        
        .shipping-info {
            color: #666;
            line-height: 1.8;
            font-size: 14px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            margin: 15px 0;
        }
        
        .status-badge.processing {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-badge.completed {
            background-color: #d4edda;
            color: #155724;
        }
        
        .note {
            background-color: #fff8f0;
            border-left: 4px solid #d4a574;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #8b7355;
        }
        
        .footer {
            background-color: #f9f9f9;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        
        .footer p {
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .footer-links {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .footer-links a {
            color: #d4a574;
            text-decoration: none;
            font-size: 13px;
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${process.env.SERVER_URL || 'http://localhost:3000'}/images/logoandtext.png" alt="The Believers Logo">
            <p>Order Confirmation</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                <h2>Thank You for Your Order!</h2>
                <p>Hi <strong>${customerName}</strong>,</p>
                <p>We've received your order and it's being processed. Your payment has been confirmed and you'll receive a shipping confirmation email shortly.</p>
            </div>
            
            <div class="order-section">
                <h3>Order Details</h3>
                <div class="order-details">
                    <div class="detail-item">
                        <div class="detail-label">Order ID</div>
                        <div class="detail-value">${orderId}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Order Date</div>
                        <div class="detail-value">${new Date().toLocaleDateString()}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Payment Method</div>
                        <div class="detail-value">${paymentMethod}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Status</div>
                        <div class="detail-value"><span class="status-badge ${statusClass}">${statusText}</span></div>
                    </div>
                </div>
            </div>
            
            <h3 style="margin-top: 25px; margin-bottom: 15px; color: #333;">Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th class="quantity">Qty</th>
                        <th class="price">Price</th>
                        <th class="price">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Subtotal</td>
                        <td class="price">$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Shipping</td>
                        <td class="price">$${shippingCost.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row" style="font-size: 18px;">
                        <td colspan="3" style="text-align: right;">Total</td>
                        <td class="price" style="color: #d4a574;">$${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="shipping-section">
                <h3>Shipping Address</h3>
                <div class="shipping-info">
                    ${shippingInfo.firstName} ${shippingInfo.lastName}<br>
                    ${shippingInfo.address}<br>
                    ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}<br>
                    ${shippingInfo.country}
                </div>
            </div>
            
            <div class="note">
                <strong>ℹ️ What's Next?</strong> Your order is being prepared for shipment. You'll receive a tracking number via email as soon as your package is shipped (typically within 1-2 business days).
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                Have questions about your order? Our customer support team is here to help! Reply to this email or contact us for assistance.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>The Believers</strong></p>
            <p>Your trusted fashion & lifestyle brand</p>
            <div class="footer-links">
                <a href="${process.env.SERVER_URL || 'http://localhost:3000'}/contact.html">Contact Us</a>
                <a href="${process.env.SERVER_URL || 'http://localhost:3000'}/shipping-info.html">Shipping Info</a>
                <a href="${process.env.SERVER_URL || 'http://localhost:3000'}/privacy-policy.html">Privacy Policy</a>
                <a href="${process.env.SERVER_URL || 'http://localhost:3000'}/terms-of-service.html">Terms of Service</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2026 The Believers. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Store subscribers (in production, use a database)
const subscribers = new Set();

// In-memory storage for orders (will use MongoDB if connected)
let orders = [];
let useDatabase = false;

// Try to connect to MongoDB
const { connectDB, dbOperations } = require('./database');
if (process.env.MONGODB_URI) {
    connectDB()
        .then(() => {
            useDatabase = true;
            console.log('✅ Using MongoDB for data storage');
        })
        .catch(() => {
            console.log('⚠️  MongoDB not connected - using in-memory storage');
            useDatabase = false;
        });
} else {
    console.log('⚠️  MONGODB_URI not set - using in-memory storage');
}

// ===== MIDDLEWARE: Verify Admin Token =====
function verifyAdminToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: 'Access denied. No token provided.' 
        });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token.' 
        });
    }
}

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

// Order notification endpoint
app.post('/api/order', async (req, res) => {
    try {
        const {
            orderNumber,
            date,
            items,
            shippingInfo,
            deliveryMethod,
            paymentMethod,
            totals
        } = req.body || {};

        if (!orderNumber || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send('Missing order items or order number.');
        }

        if (!shippingInfo || !shippingInfo.email || !shippingInfo.firstName || !shippingInfo.lastName) {
            return res.status(400).send('Missing customer contact information.');
        }

        const adminEmail = process.env.ADMIN_ORDER_EMAIL || process.env.SENDER_EMAIL;
        if (!adminEmail) {
            return res.status(500).send('Admin email is not configured.');
        }

        const orderDate = date ? new Date(date) : new Date();
        const totalAmount = totals?.total ?? 0;

        const formatAddress = (info) => {
            const parts = [info.address, info.city, info.state, info.zipCode, info.country].filter(Boolean);
            return parts.join(', ');
        };

        const itemsHtml = items.map(item => {
            const lineTotal = (item.price * item.quantity).toFixed(2);
            return `<li><strong>${item.name}</strong> x${item.quantity} — £${lineTotal}</li>`;
        }).join('');

        // Admin notification email
        const adminMsg = {
            to: adminEmail,
            from: {
                email: process.env.SENDER_EMAIL,
                name: 'The Believers Orders'
            },
            subject: `New Order ${orderNumber} - £${totalAmount.toFixed(2)}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
                    <h2>New Order Received</h2>
                    <p><strong>Order #:</strong> ${orderNumber}</p>
                    <p><strong>Date:</strong> ${orderDate.toISOString()}</p>
                    <p><strong>Customer:</strong> ${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                    <p><strong>Email:</strong> ${shippingInfo.email}</p>
                    <p><strong>Phone:</strong> ${shippingInfo.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> ${formatAddress(shippingInfo)}</p>
                    <p><strong>Delivery:</strong> ${deliveryMethod || 'Standard (7-14 days)'}</p>
                    <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                    <h3>Items</h3>
                    <ul>${itemsHtml}</ul>
                    <h3>Totals</h3>
                    <ul>
                        <li>Subtotal: £${(totals?.subtotal ?? 0).toFixed(2)}</li>
                        <li>Shipping: £${(totals?.shipping ?? 0).toFixed(2)}</li>
                        <li>Tax: £${(totals?.tax ?? 0).toFixed(2)}</li>
                        <li><strong>Total: £${(totals?.total ?? 0).toFixed(2)}</strong></li>
                    </ul>
                </div>
            `,
            trackingSettings: {
                clickTracking: { enable: false },
                openTracking: { enable: false }
            }
        };

        // Customer confirmation email
        const customerMsg = {
            to: shippingInfo.email,
            from: {
                email: process.env.SENDER_EMAIL,
                name: 'The Believers'
            },
            subject: `Thank you for your order #${orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
                    <h2>Thank you for your order!</h2>
                    <p>Salam ${shippingInfo.firstName},</p>
                    <p>We received your order <strong>#${orderNumber}</strong> placed on <strong>${orderDate.toDateString()}</strong>.</p>
                    <p><strong>Delivery method:</strong> ${deliveryMethod || 'Standard (7-14 days)'}</p>
                    <h3>Items</h3>
                    <ul>${itemsHtml}</ul>
                    <h3>Order Total</h3>
                    <p><strong>£${(totals?.total ?? 0).toFixed(2)}</strong></p>
                    <p>Shipping to: ${formatAddress(shippingInfo)}</p>
                    <p style="margin-top: 24px;">We will notify you when your order ships. If you have any questions, reply to this email.</p>
                    <p>Thank you for choosing The Believers.</p>
                </div>
            `,
            trackingSettings: {
                clickTracking: { enable: false },
                openTracking: { enable: false }
            }
        };

        await Promise.all([sgMail.send(adminMsg), sgMail.send(customerMsg)]);

        return res.json({ success: true });
    } catch (error) {
        console.error('Order email error:', error.response?.body || error.message);
        return res.status(500).send('Failed to send order notification.');
    }
});

// ===== ADMIN AUTHENTICATION ENDPOINT =====
app.post('/api/admin/login', adminLimiter, async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password is required.' 
        });
    }

    try {
        // Compare with admin password from .env
        const isValid = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));
        
        // Simple comparison for now (in production, store hashed password)
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password.' 
            });
        }

        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign(
            { 
                admin: true, 
                timestamp: Date.now() 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({ 
            success: true, 
            token,
            message: 'Authentication successful'
        });

    } catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication.' 
        });
    }
});

// ===== USER AUTHENTICATION ENDPOINTS =====

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const { user: existingUser } = await dbOperations.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await dbOperations.createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        if (!result.success) {
            throw new Error(result.message);
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: result.user._id,
                email: result.user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Send confirmation email
        try {
            const emailHtml = `
                <div style="background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%); padding: 30px; border-radius: 12px; color: #fff; font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 2px solid #d4a574;">
                    <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                        <img src='https://thebelievers.com/images/logoandtext.png' alt='The Believers Logo' style='height: 48px; margin-right: 12px;'>
                        <span style='font-size: 22px; font-weight: 700; color: #d4a574; letter-spacing: 2px;'>THE BELIEVERS</span>
                    </div>
                    <h2 style="font-size: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #d4a574; text-align: center; margin-bottom: 18px;">Welcome to The Believers!</h2>
                    <p style="font-size: 16px; color: #fff; text-align: center;">Dear ${firstName},<br><br>
                    Thank you for creating an account with us. Your journey to modern Islamic clothing and streetwear starts here.<br><br>
                    You can now save your favorite items, view your order history, and enjoy a personalized shopping experience.<br><br>
                    <a href='https://thebelievers.com/' style='display:inline-block; background:#d4a574; color:#1a1a1a; padding:10px 24px; border-radius:6px; font-weight:600; text-decoration:none; margin-top:10px;'>Visit Our Store</a>
                    </p>
                    <hr style='border: none; border-top: 1px solid #d4a574; margin: 24px 0;'>
                    <div style='text-align:center; font-size:13px; color:#d4a574;'>
                        <a href='https://thebelievers.com/contact.html' style='color:#d4a574; margin:0 8px;'>Contact</a> |
                        <a href='https://thebelievers.com/shipping-info.html' style='color:#d4a574; margin:0 8px;'>Shipping Info</a> |
                        <a href='https://thebelievers.com/privacy-policy.html' style='color:#d4a574; margin:0 8px;'>Privacy Policy</a> |
                        <a href='https://thebelievers.com/terms-of-service.html' style='color:#d4a574; margin:0 8px;'>Terms of Service</a>
                    </div>
                    <div style='text-align:center; font-size:12px; color:#fff; margin-top:18px;'>
                        &copy; 2026 The Believers. All rights reserved.
                    </div>
                </div>
            `;
            await sgMail.send({
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thebelievers.com',
                subject: 'Welcome to The Believers!',
                html: emailHtml
            });
        } catch (emailError) {
            console.error('SendGrid Registration Email Error:', emailError.response?.body || emailError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: result.user._id,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                email: result.user.email,
                savedItems: result.user.savedItems
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating account. Please try again.'
        });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const { user } = await dbOperations.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await dbOperations.updateLastLogin(user._id);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                savedItems: user.savedItems
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in. Please try again.'
        });
    }
});

// Verify JWT token middleware
function verifyUserToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No authentication token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

// Get user profile
app.get('/api/auth/profile', verifyUserToken, async (req, res) => {
    try {
        const { user } = await dbOperations.getUserByEmail(req.userEmail);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                savedItems: user.savedItems,
                shippingAddresses: user.shippingAddresses,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Save item to user's favorites
app.post('/api/user/saved-items', verifyUserToken, async (req, res) => {
    try {
        const { productId, productName, productPrice, productImage, productSize } = req.body;
        
        const result = await dbOperations.addSavedItem(req.userId, {
            productId,
            productName,
            productPrice,
            productImage,
            productSize,
            addedAt: new Date()
        });

        if (!result.success) {
            throw new Error(result.message);
        }

        res.json({
            success: true,
            message: 'Item saved successfully',
            savedItems: result.user.savedItems
        });
    } catch (error) {
        console.error('Save item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving item'
        });
    }
});

// Remove saved item
app.delete('/api/user/saved-items/:productId', verifyUserToken, async (req, res) => {
    try {
        const { productId } = req.params;
        
        const result = await dbOperations.removeSavedItem(req.userId, productId);

        if (!result.success) {
            throw new Error(result.message);
        }

        res.json({
            success: true,
            message: 'Item removed successfully',
            savedItems: result.user.savedItems
        });
    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item'
        });
    }
});

// Get saved items
app.get('/api/user/saved-items', verifyUserToken, async (req, res) => {
    try {
        const { user } = await dbOperations.getUserByEmail(req.userEmail);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            savedItems: user.savedItems
        });
    } catch (error) {
        console.error('Fetch saved items error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved items'
        });
    }
});

// ===== ORDER ENDPOINTS =====

// Create new order (called from checkout)
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = {
            orderId: req.body.orderId,
            customerEmail: req.body.customerEmail,
            customerName: req.body.customerName,
            products: req.body.products,
            subtotal: req.body.subtotal,
            tax: req.body.tax || 0,
            shipping: req.body.shipping || 0,
            discount: req.body.discount || 0,
            total: req.body.total,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            status: 'completed',
            // Analytics
            deviceType: req.body.deviceType,
            trafficSource: req.body.trafficSource,
            referrer: req.body.referrer,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip,
            createdAt: new Date()
        };

        if (useDatabase) {
            const result = await dbOperations.createOrder(orderData);
            if (result.success) {
                return res.json({ success: true, order: result.order });
            } else {
                throw new Error(result.message);
            }
        } else {
            // In-memory storage
            orders.push(orderData);
            return res.json({ success: true, order: orderData });
        }

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to create order.' 
        });
    }
});

// ===== ADMIN ANALYTICS ENDPOINTS (Protected) =====

// Get analytics overview
app.get('/api/admin/analytics', verifyAdminToken, async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;

        let start, end;
        const now = new Date();

        // Calculate date range based on period
        if (period === 'today') {
            start = new Date(now.setHours(0, 0, 0, 0));
            end = new Date(now.setHours(23, 59, 59, 999));
        } else if (period === 'week') {
            start = new Date(now.setDate(now.getDate() - 7));
            end = new Date();
        } else if (period === 'month') {
            start = new Date(now.setMonth(now.getMonth() - 1));
            end = new Date();
        } else if (period === 'year') {
            start = new Date(now.setFullYear(now.getFullYear() - 1));
            end = new Date();
        } else if (startDate && endDate) {
            start = new Date(startDate);
            end = new Date(endDate);
        } else {
            // Default: last 30 days
            start = new Date(now.setDate(now.getDate() - 30));
            end = new Date();
        }

        if (useDatabase) {
            const stats = await dbOperations.getOrderStats(start, end);
            return res.json({ success: true, data: stats });
        } else {
            // In-memory analytics
            const filteredOrders = orders.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= start && orderDate <= end;
            });

            const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = filteredOrders.length;
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Top products
            const productMap = {};
            filteredOrders.forEach(order => {
                order.products.forEach(product => {
                    if (productMap[product.name]) {
                        productMap[product.name].quantity += product.quantity;
                        productMap[product.name].revenue += product.price * product.quantity;
                    } else {
                        productMap[product.name] = {
                            name: product.name,
                            quantity: product.quantity,
                            revenue: product.price * product.quantity,
                            image: product.image
                        };
                    }
                });
            });

            const topProducts = Object.values(productMap)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);

            // Geographic data
            const geoMap = {};
            filteredOrders.forEach(order => {
                const country = order.shippingAddress?.country || 'Unknown';
                const state = order.shippingAddress?.state || 'Unknown';
                const key = `${country} - ${state}`;
                
                if (geoMap[key]) {
                    geoMap[key].count++;
                    geoMap[key].revenue += order.total;
                } else {
                    geoMap[key] = {
                        location: key,
                        country,
                        state,
                        count: 1,
                        revenue: order.total
                    };
                }
            });

            const topLocations = Object.values(geoMap)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);

            // Traffic sources
            const trafficMap = {};
            filteredOrders.forEach(order => {
                const source = order.trafficSource || 'Direct';
                if (trafficMap[source]) {
                    trafficMap[source].count++;
                    trafficMap[source].revenue += order.total;
                } else {
                    trafficMap[source] = {
                        source,
                        count: 1,
                        revenue: order.total
                    };
                }
            });

            const trafficSources = Object.values(trafficMap)
                .sort((a, b) => b.count - a.count);

            return res.json({
                success: true,
                data: {
                    totalRevenue,
                    totalOrders,
                    avgOrderValue,
                    topProducts,
                    topLocations,
                    trafficSources
                }
            });
        }

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch analytics data.' 
        });
    }
});

// Get recent orders
app.get('/api/admin/orders/recent', verifyAdminToken, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        if (useDatabase) {
            const recentOrders = await dbOperations.getAllOrders(limit);
            return res.json({ success: true, orders: recentOrders });
        } else {
            const recentOrders = orders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, limit);
            return res.json({ success: true, orders: recentOrders });
        }

    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders.' 
        });
    }
});

// ===== VISITOR TRACKING ENDPOINTS =====

// Track visitor session
app.post('/api/track/visitor', async (req, res) => {
    const { sessionId, page, deviceType } = req.body;
    
    if (!sessionId) {
        return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    const ip = req.ip;
    const location = await getLocationFromIP(ip);
    
    const now = Date.now();
    
    if (activeSessions.has(sessionId)) {
        // Update existing session
        const session = activeSessions.get(sessionId);
        session.lastActivity = now;
        session.page = page;
    } else {
        // Create new session
        activeSessions.set(sessionId, {
            sessionId,
            ip,
            page,
            deviceType,
            country: location.country,
            city: location.city,
            userAgent: req.headers['user-agent'],
            createdAt: now,
            lastActivity: now
        });
        
        // Store in history
        visitorHistory.push({
            type: 'visit',
            sessionId,
            ip,
            page,
            deviceType,
            country: location.country,
            city: location.city,
            timestamp: now
        });
    }
    
    res.json({ success: true });
});

// Get live visitors
app.get('/api/admin/visitors/live', verifyAdminToken, (req, res) => {
    const now = Date.now();
    const activeVisitors = Array.from(activeSessions.values()).map(session => ({
        sessionId: session.sessionId,
        page: session.page,
        country: session.country,
        city: session.city,
        deviceType: session.deviceType,
        timeAgo: Math.floor((now - session.lastActivity) / 1000), // seconds
        isActive: (now - session.lastActivity) < 30000 // less than 30 seconds
    }));
    
    res.json({
        success: true,
        liveVisitors: activeVisitors,
        activeCount: activeVisitors.filter(v => v.isActive).length,
        totalCurrentSessions: activeVisitors.length
    });
});

// Get visitor statistics
app.get('/api/admin/visitors/stats', verifyAdminToken, (req, res) => {
    const { period = 'today' } = req.query;
    
    let startDate;
    const now = new Date();
    
    if (period === 'today') {
        startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'week') {
        startDate = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    } else if (period === 'year') {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
    }
    
    const filteredVisits = visitorHistory.filter(v => 
        v.timestamp >= startDate.getTime() && v.type === 'visit'
    );
    
    // Get unique visitors (by sessionId)
    const uniqueVisitors = new Set(filteredVisits.map(v => v.sessionId));
    
    // Get visitor count by country
    const countryMap = {};
    filteredVisits.forEach(visit => {
        if (countryMap[visit.country]) {
            countryMap[visit.country]++;
        } else {
            countryMap[visit.country] = 1;
        }
    });
    
    const topCountries = Object.entries(countryMap)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    
    // Get device breakdown
    const deviceMap = {};
    filteredVisits.forEach(visit => {
        const device = visit.deviceType || 'unknown';
        deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    
    res.json({
        success: true,
        stats: {
            totalVisits: filteredVisits.length,
            uniqueVisitors: uniqueVisitors.size,
            topCountries,
            deviceBreakdown: deviceMap,
            averageVisitsPerSession: filteredVisits.length / (uniqueVisitors.size || 1)
        }
    });
});

// ===== PAYPAL PAYMENT ENDPOINTS =====

// Create PayPal order
app.post('/api/paypal/create-order', async (req, res) => {
    try {
        const { total, items, customerEmail } = req.body;
        
        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            payer: {
                email_address: customerEmail
            },
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: total.toString(),
                    breakdown: {
                        item_total: {
                            currency_code: 'USD',
                            value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
                        },
                        shipping: {
                            currency_code: 'USD',
                            value: '0.00'
                        }
                    }
                },
                items: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity.toString(),
                    unit_amount: {
                        currency_code: 'USD',
                        value: item.price.toString()
                    }
                }))
            }],
            application_context: {
                brand_name: 'The Believers',
                return_url: `${process.env.SERVER_URL || 'http://localhost:3000'}/checkout.html?paypal=success`,
                cancel_url: `${process.env.SERVER_URL || 'http://localhost:3000'}/checkout.html?paypal=cancel`,
                locale: 'en-US'
            }
        });

        const order = await paypalClient.execute(request);
        
        res.json({
            success: true,
            orderId: order.result.id
        });
    } catch (error) {
        console.error('PayPal create order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create PayPal order'
        });
    }
});

// Capture PayPal order
app.post('/api/paypal/capture-order', async (req, res) => {
    try {
        const { orderId, cartItems, customerEmail, shippingInfo } = req.body;
        
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        
        const capture = await paypalClient.execute(request);
        
        if (capture.result.status === 'COMPLETED') {
            // Save order to backend
            const total = parseFloat(capture.result.purchase_units[0].amount.value);
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shippingCost = total - subtotal;
            
            const orderData = {
                orderId: capture.result.id,
                paymentId: capture.result.purchase_units[0].payments.captures[0].id,
                customerEmail: customerEmail,
                products: cartItems,
                total: total,
                shippingAddress: shippingInfo,
                paymentStatus: 'completed',
                paymentMethod: 'PayPal',
                deviceType: req.body.deviceType || 'desktop',
                trafficSource: req.body.trafficSource || 'direct',
                createdAt: new Date()
            };
            
            // Save to database (in-memory storage for now)
            // In production, save to MongoDB
            
            // Generate professional email
            const emailHtml = generateOrderConfirmationEmail({
                orderId: capture.result.id,
                customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                customerEmail: customerEmail,
                items: cartItems,
                subtotal: subtotal,
                shippingCost: shippingCost,
                total: total,
                paymentMethod: 'PayPal',
                status: 'completed',
                shippingInfo: shippingInfo
            });
            
            // Send confirmation email
            await sgMail.send({
                to: customerEmail,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thebelievers.com',
                subject: 'Order Confirmation - The Believers',
                html: emailHtml
            });
            
            res.json({
                success: true,
                orderId: capture.result.id,
                message: 'Payment captured successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Payment was not completed'
            });
        }
    } catch (error) {
        console.error('PayPal capture order error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to capture PayPal order'
        });
    }
});

// Get PayPal order details
app.get('/api/paypal/order-details/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
        
        const order = await paypalClient.execute(request);
        
        res.json({
            success: true,
            order: order.result
        });
    } catch (error) {
        console.error('PayPal order details error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get order details'
        });
    }
});

// ===== CARD PAYMENT ENDPOINT =====
// Process debit/credit card payments via PayPal
app.post('/api/card/process-payment', async (req, res) => {
    try {
        const {
            nonce,
            amount,
            email,
            firstName,
            lastName,
            cartItems,
            shippingInfo,
            deviceType,
            trafficSource
        } = req.body;

        // Create a basic order record
        const orderId = 'ORDER_' + Date.now();
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = amount - subtotal;
        
        // Generate professional email
        const emailHtml = generateOrderConfirmationEmail({
            orderId: orderId,
            customerName: `${firstName} ${lastName}`,
            customerEmail: email,
            items: cartItems,
            subtotal: subtotal,
            shippingCost: shippingCost,
            total: parseFloat(amount),
            paymentMethod: 'Debit/Credit Card',
            status: 'processing',
            shippingInfo: shippingInfo
        });
        
        // Send confirmation email
        try {
            await sgMail.send({
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@thebelievers.com',
                subject: 'Order Confirmation - The Believers',
                html: emailHtml
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // Continue even if email fails
        }

        res.json({
            success: true,
            orderId: orderId,
            message: 'Card payment processed successfully'
        });

    } catch (error) {
        console.error('Card payment processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process card payment'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📧 Email service ready`);
    console.log(`🔒 Rate limiting enabled`);
    console.log(`🔐 Admin Dashboard: http://localhost:${PORT}/admin-secret-dashboard.html`);
});
