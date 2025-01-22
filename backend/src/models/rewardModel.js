import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/1200px-Latte_and_dark_coffee.jpg",
  },
  bgColor: { type: String, default: "#111827" },
  textColor: { type: String, default: "#10B981" },
  buttonColor: { type: String, default: "#1F2937" },
});

const rewardSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: { type: String, required: true },
    expiry: { type: Boolean, required: true },
    expiryDate: { type: Date },
    description: { type: String},
    validity: { type: String, required: true },
    points: { type: String, required: true },
    evergreen: { type: Boolean, required: true },
    template: { type: templateSchema, default: () => ({}) }, // Use the embedded schema
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reward", rewardSchema);
