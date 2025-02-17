const mongoose = require("mongoose");

// Define the schema for the Order model
const orderSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store", // Reference to the Shop model
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productQuantity: {
        type: Number,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      productTotalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "bill_pending",
      "returned",
      "refund_processing",
      "refunded",
      "failed",
    ], // Enum for order status
    default: "pending",
  },
});

// Create and export the model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
