const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/components/notification_cmt/config/db'); 
const notificationRoutes = require('./src/components/notification_cmt/routes/notification');


dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

