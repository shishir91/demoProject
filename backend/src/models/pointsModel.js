import mongoose from "mongoose";

const pointsSchema = new mongoose.Schema(
  {
    points: {
      type: Number,
      required: true,
      default: 1,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Points", pointsSchema);
