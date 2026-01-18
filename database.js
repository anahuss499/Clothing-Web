# Newsletter Database Storage (Optional Enhancement)
# This file shows how to integrate a database for production use

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

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

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
    }
};

// Export for use in server.js
module.exports = { connectDB, dbOperations, Subscriber };

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
