//src/components/notification_cmt/models/notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: String,
    default: null
  }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;