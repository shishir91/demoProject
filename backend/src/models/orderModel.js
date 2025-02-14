const mongoose = require('mongoose');

// Define the schema for the Order model
const orderSchema = new mongoose.Schema({
  userName: { 
    type: String,
    required: true 
  },
  userPhone: { 
    type: String,
    required: true 
  },
  userAddress: { 
    type: String,
    required: true 
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',  // Reference to the Shop model
    required: true
  },
  products: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',  // Reference to the Product model
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  subTotal: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now  // Automatically set the current date and time when the order is created
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],  // Enum for order status
    default: 'pending'
  }
});

// Create and export the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
