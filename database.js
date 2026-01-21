// Newsletter Database Storage (Optional Enhancement)
// This file shows how to integrate a database for production use

const mongoose = require('mongoose');

// Subscriber Schema
const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: 'website'
    }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    products: [{
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    // Analytics data
    deviceType: String,
    trafficSource: String,
    referrer: String,
    userAgent: String,
    ipAddress: String,
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Analytics Event Schema (for page views, clicks, etc.)
const analyticsEventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: ['pageview', 'product_view', 'add_to_cart', 'checkout_start', 'purchase']
    },
    userId: String,
    sessionId: String,
    productId: String,
    productName: String,
    category: String,
    value: Number,
    metadata: {
        type: Map,
        of: String
    },
    deviceType: String,
    trafficSource: String,
    referrer: String,
    country: String,
    state: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// User Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    savedItems: [{
        productId: String,
        productName: String,
        productPrice: Number,
        productImage: String,
        productSize: String,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    shippingAddresses: [{
        isDefault: {
            type: Boolean,
            default: false
        },
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);
const Order = mongoose.model('Order', orderSchema);
const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
const User = mongoose.model('User', userSchema);

// Database connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('📊 Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

// Database operations
const dbOperations = {
    // Add subscriber
    async addSubscriber(email) {
        try {
            const subscriber = new Subscriber({ email });
            await subscriber.save();
            return { success: true, subscriber };
        } catch (error) {
            if (error.code === 11000) {
                return { success: false, message: 'Email already subscribed' };
            }
            throw error;
        }
    },

    // Get all active subscribers
    async getActiveSubscribers() {
        return await Subscriber.find({ active: true });
    },

    // Unsubscribe
    async unsubscribe(email) {
        return await Subscriber.findOneAndUpdate(
            { email: email.toLowerCase() },
            { active: false },
            { new: true }
        );
    },

    // Get subscriber count
    async getCount() {
        return await Subscriber.countDocuments({ active: true });
    },

    // ===== ORDER OPERATIONS =====
    
    // Create new order
    async createOrder(orderData) {
        try {
            const order = new Order(orderData);
            await order.save();
            return { success: true, order };
        } catch (error) {
            console.error('Error creating order:', error);
            return { success: false, message: error.message };
        }
    },

    // Get all orders
    async getAllOrders(limit = 100) {
        return await Order.find().sort({ createdAt: -1 }).limit(limit);
    },

    // Get orders by date range
    async getOrdersByDateRange(startDate, endDate) {
        return await Order.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ createdAt: -1 });
    },

    // Get order statistics
    async getOrderStats(startDate, endDate) {
        const orders = await this.getOrdersByDateRange(startDate, endDate);
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Top products
        const productMap = {};
        orders.forEach(order => {
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
        orders.forEach(order => {
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
        orders.forEach(order => {
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

        return {
            totalRevenue,
            totalOrders,
            avgOrderValue,
            topProducts,
            topLocations,
            trafficSources
        };
    },

    // ===== ANALYTICS EVENT OPERATIONS =====
    
    // Track analytics event
    async trackEvent(eventData) {
        try {
            const event = new AnalyticsEvent(eventData);
            await event.save();
            return { success: true, event };
        } catch (error) {
            console.error('Error tracking event:', error);
            return { success: false, message: error.message };
        }
    },

    // User operations
    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return { success: true, user };
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, message: error.message };
        }
    },

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email, isActive: true });
            return { success: true, user };
        } catch (error) {
            console.error('Error finding user:', error);
            return { success: false, message: error.message };
        }
    },

    async updateUserSavedItems(userId, savedItems) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { savedItems },
                { new: true }
            );
            return { success: true, user };
        } catch (error) {
            console.error('Error updating saved items:', error);
            return { success: false, message: error.message };
        }
    },

    async addSavedItem(userId, item) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            
            // Check if item already exists
            const exists = user.savedItems.some(saved => saved.productId === item.productId);
            if (!exists) {
                user.savedItems.push(item);
                await user.save();
            }
            
            return { success: true, user };
        } catch (error) {
            console.error('Error adding saved item:', error);
            return { success: false, message: error.message };
        }
    },

    async removeSavedItem(userId, productId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            
            user.savedItems = user.savedItems.filter(item => item.productId !== productId);
            await user.save();
            
            return { success: true, user };
        } catch (error) {
            console.error('Error removing saved item:', error);
            return { success: false, message: error.message };
        }
    },

    async updateLastLogin(userId) {
        try {
            await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
            return { success: true };
        } catch (error) {
            console.error('Error updating last login:', error);
            return { success: false, message: error.message };
        }
    }
};

// Export for use in server.js
module.exports = { connectDB, dbOperations, Subscriber, Order, AnalyticsEvent, User };

/* 
To use this in production:
1. Install MongoDB: npm install mongoose
2. Add to .env: MONGODB_URI=mongodb://localhost:27017/thebelievers
3. In server.js, replace the Set() with database operations:
   
   const { connectDB, dbOperations } = require('./database');
   await connectDB();
   
   // Then use:
   await dbOperations.addSubscriber(email);
   const subscribers = await dbOperations.getActiveSubscribers();
*/
