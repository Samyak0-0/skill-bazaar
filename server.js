// Import necessary modules using CommonJS syntax
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/components/notification_cmt/config/db'); 
const notificationRoutes = require('./src/components/notification_cmt/routes/notification');

// Initialize dotenv for environment variables
dotenv.config();

// Create an instance of express
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Set up a middleware to parse JSON bodies
app.use(express.json());

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
