// Import necessary modules using ES6 syntax
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notificationRoutes from './src/components/notification_cmt/routes/notification.js';
import orderRouter from './routes/order.js';


app.use('/api/orders', orderRouter);

// Initialize dotenv for environment variables
dotenv.config();

// Create an instance of express
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB URI from the environment variable
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://samyakmhrzn9841:KEHlgifW1NgWpIjo@cluster0.rzgwy.mongodb.net/Skill-Bazaaar?retryWrites=true&w=majority&appName=Cluster0';

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


// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import notificationRoutes from './routes/notification.js';

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/notifications', notificationRoutes);

// const mongoURI = process.env.MONGO_URI;
// const PORT = process.env.PORT || 5000;

// mongoose.connect(mongoURI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('MongoDB connection error:', err);
//   });