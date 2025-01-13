// Import necessary modules using ES6 syntax
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/components/notification_cmt/config/db.js';
import notificationRoutes from './src/components/notification_cmt/routes/notification.js';

// Initialize dotenv for environment variables
dotenv.config();

// Create an instance of express
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB URI from the environment variable
const mongoURI = process.env.MONGO_URI || 'your-mongo-db-uri-here'; // Make sure to add this in .env

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, Skill Bazaar!');
});

// Set the server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
