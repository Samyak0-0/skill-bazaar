import express from 'express';
import Notification from '../models/Notification.js';
//import Order from '../models/order.js'; // Import the Order model

const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to most recent 50 notifications
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { type, message, userId, orderId, read = false } = req.body;
    
    const newNotification = new Notification({
      type,
      message,
      userId,
      orderId,
      read,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedNotification = await newNotification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//order
// try{
// const newNotification = new Notification({
//   type: 'New Order',
//   message: `You have a new Order: ${savedOrder.workTitle} (${savedOrder.category}) - $${savedOrder.rate}`,
//   userId: savedOrder.buyerId,
//   orderId: savedOrder.id,
//   read: false,
//   createdAt: new Date(),
//   updatedAt: new Date()
// });

// await newNotification.save();

// res.status(201).json(savedOrder);
// } catch (error) {
// res.status(400).json({ error: error.message });
// }


// Marks a notification as read when you click 
router.patch('/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { 
        read: true, 
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification is not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;