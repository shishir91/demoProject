import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, require: true, default: "user" },
    status: { type: String, required: true, default: "active" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userModel);
