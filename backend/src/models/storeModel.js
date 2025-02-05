import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema({
  format: {
    type: String,
    enum: ["L1", "L2"],
    default: "L2",
  },
  totalShapes: { type: Number, default: 9 },
  stampColor: { type: String, default: "#22C55E" },
  cardColor: { type: String, default: "#016e49" },
  textColor: { type: String, default: "#ffffff" },
  stamp: { type: String },
  customStamp: { type: String },
});
const servicesSchema = new mongoose.Schema({
  loyalty: { type: Boolean, default: true },
  reservation: { type: Boolean, default: false },
  catalogue: { type: Boolean, default: false },
  games: { type: Boolean, default: false },
  share: { type: Boolean, default: false },
});

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    pin: { type: String },
    email: { type: String },
    pass: { type: String },
    loyaltyCard: { type: loyaltySchema, default: () => ({}) },
    services: { type: servicesSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["active", "deactive"],
      default: "active",
    },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Store", storeSchema);
