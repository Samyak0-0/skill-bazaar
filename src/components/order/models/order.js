import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  workTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rate: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  serviceId: {
    type: String,
    required: true
  },
  buyerId: {
    type: String,
    required: true
  },
  sellerId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'PENDING'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;