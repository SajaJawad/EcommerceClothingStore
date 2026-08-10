import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Windows Node.js DNS SRV lookup failure for MongoDB Atlas
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB Connected');
    });

    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
};

export default connectDB;