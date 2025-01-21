import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './src/components/notification_cmt/config/db.js';
import notificationRoutes from './src/components/notification_cmt/routes/notification.js';

dotenv.config();

const app = express();

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