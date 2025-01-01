const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
    try {
        const { userId, message, type } = req.body;
        const notification = await Notification.create({ userId, message, type });
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createNotification, getNotifications };
