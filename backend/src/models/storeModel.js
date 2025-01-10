import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    location: { type: String, required: true, maxlength: 100 },

    phone: { type: String, required: true },

    // logo: { type: Date, required: true },

    url: { type: String, required: true },

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
