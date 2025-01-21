import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    message: { type: String, required: true, maxlength: 100 },

    dateandtime: { type: Date, required: true },

    status: { type: String, required: true, default: "submitted" },

    createdBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
