const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');

const router = express.Router();

// Create a new notification
router.post('/', createNotification);

// Get all notifications
router.get('/', getNotifications);

module.exports = router;
