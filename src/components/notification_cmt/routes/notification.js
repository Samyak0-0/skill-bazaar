const express = require('express');
const { createNotification, getNotifications } = require('../controllers/notificationController');

const router = express.Router();

// Get all notifications
router.get('/', getNotifications);

module.exports = router;
