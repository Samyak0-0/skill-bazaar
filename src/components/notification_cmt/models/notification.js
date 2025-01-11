const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'alert', 'warning'], default: 'info' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Add an index to improve query performance for the `isRead` field
notificationSchema.index({ isRead: 1 });

// Export the model
module.exports = mongoose.model('Notification', notificationSchema);
