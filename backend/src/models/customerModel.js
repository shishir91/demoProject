import mongoose from "mongoose";

const customerModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    points: { type: Number, required: true, default: 0 },
    // store: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Store",
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);
// Compound index to ensure unique email and phone per store
// customerSchema.index({ store: 1, email: 1 }, { unique: true });
// customerSchema.index({ store: 1, phone: 1 }, { unique: true });

export default mongoose.model("Customer", customerModel);
