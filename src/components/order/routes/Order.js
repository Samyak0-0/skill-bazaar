import express from 'express';
import Order from '../models/order.js';
import Notification from '../models/Notification.js';

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { workTitle, description, rate, category, serviceId, buyerId, sellerId } = req.body;

    const newOrder = new Order({
      workTitle,
      description,
      rate,
      category,
      serviceId,
      buyerId,
      sellerId,
      status: 'PENDING'
    });

    const savedOrder = await newOrder.save();

    // Create a new notification for the new order
    const newNotification = new Notification({
      type: 'New Order',
      message: `New order created: ${savedOrder.workTitle} (${savedOrder.category}) - $${savedOrder.rate}`,
      userId: savedOrder.buyerId,
      orderId: savedOrder.id,
      read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newNotification.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
