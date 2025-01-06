const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        // Destructure userId, message, and type from request body
        const { userId, message, type } = req.body;

        // Create a new notification in the database
        const notification = await Notification.create({ userId, message, type });

        // Send the created notification as a response with 201 status (created)
        res.status(201).json(notification);
    } catch (error) {
        // If there's an error, send a 500 status with error message
        res.status(500).json({ error: error.message });
    }
};

// Get all notifications from the database
const getNotifications = async (req, res) => {
    try {
        // Retrieve all notifications
        const notifications = await Notification.find();

        // Send the notifications as a response with 200 status (OK)
        res.status(200).json(notifications);
    } catch (error) {
        // If there's an error, send a 500 status with error message
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createNotification, getNotifications };
