import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      // required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountRate: {
    type: Number, // Optional discount
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
});

export default mongoose.model("Product", productSchema);
