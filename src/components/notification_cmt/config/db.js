const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`); // Log successful connection
    } catch (error) {
        console.error(`Error: ${error.message}`); // Log error details
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
console.log(`Connected to database: ${conn.connection.name}`);
