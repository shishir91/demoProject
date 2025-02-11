// import mongoose from "mongoose";
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  subject: { type: String, default: "" },
  message: { type: String, default: "" },
});

const adminMessageSchema = new mongoose.Schema({
  to: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, default: "" },
});

const smsSchema = new mongoose.Schema({
  from: { type: String, default: "" },
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
    mailAfterLogin: { type: messageSchema, default: () => ({}) },
    mailAfterPointEarned: { type: messageSchema, default: () => ({}) },
    mailAfterRewardRedeemed: { type: messageSchema, default: () => ({}) },
    mailAfterRewardRedeemed_Admin: {
      type: adminMessageSchema,
      default: () => ({}),
    },
    smsAfterLogin: { type: smsSchema, default: () => ({}) },
    smsAfterPointEarned: { type: smsSchema, default: () => ({}) },
    smsAfterRewardRedeemed: { type: smsSchema, default: () => ({}) },
    smsAfterRewardRedeemed_Admin: {
      type: smsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// export default mongoose.model("MailSMS", mailSMSSchema);
module.exports = mongoose.model("MailSMS", mailSMSSchema);
