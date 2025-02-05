// import mongoose from "mongoose";
const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "claimed", "expired"],
      default: "pending",
    },
    redeemDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Auto-calculated below
  },
  { timestamps: true }
);

// Pre-save hook to calculate expiryDate before saving
redemptionSchema.pre("save", async function (next) {
  if (!this.expiryDate) {
    const reward = await mongoose.model("Reward").findById(this.reward);
    if (reward && reward.validity) {
      this.expiryDate = new Date(this.redeemDate);
      this.expiryDate.setDate(
        this.expiryDate.getDate() + Number(reward.validity)
      );
    }
  }
  next();
});

// export default mongoose.model("Redemption", redemptionSchema);
module.exports = mongoose.model("Redemption", redemptionSchema);
