import mongoose from "mongoose";

const loyalitySchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      unique: true,
      required: true,
    },
    title: { type: String, required: true },
    logo: { type: String },
    text: { type: String, required: true },
    sec_text: { type: String, required: true },
    bgColor: { type: String, required: true },
    shape: { type: String, required: true },
    stampColor: { type: String, required: true },
    stamp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Loyality", loyalitySchema);
