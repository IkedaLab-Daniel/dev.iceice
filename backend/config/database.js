const mongoose = require('mongoose');

const connectDB = async () => { 
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;