import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  subject: { type: String, default: "" },
  message: { type: String, default: "" },
});

const adminMessageSchema = new mongoose.Schema({
  to: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, default: "" },
});

// Main schema
const mailSMSSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      unique: true,
    },
    messageAfterLogin: { type: messageSchema, default: () => ({}) },
    messageAfterPointEarned: { type: messageSchema, default: () => ({}) },
    messageAfterRewardRedeemed: { type: messageSchema, default: () => ({}) },
    messageAfterRewardRedeemed_Admin: {
      type: adminMessageSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

export default mongoose.model("MailSMS", mailSMSSchema);
