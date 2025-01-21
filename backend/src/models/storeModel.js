import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    location: { type: String, required: true },

    phone: { type: String, required: true },

    logo: { type: String, required: true },

    url: { type: String, required: true, unique: true },

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
