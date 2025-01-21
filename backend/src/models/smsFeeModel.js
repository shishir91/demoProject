import mongoose from "mongoose";

const smsFeeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      default: 1.7,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SMSFee", smsFeeSchema);
