const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const loyaltySchema = new mongoose.Schema({
  format: {
    type: String,
    enum: ["L1", "L2"],
    default: "L2",
  },
  totalShapes: { type: Number, default: 9 },
  stampColor: { type: String, default: "#22C55E" },
  cardColor: { type: String, default: "#016e49" },
  textColor: { type: String, default: "#ffffff" },
  stamp: { type: String, default: "" },
  customStamp: { type: String, default: "" },
});

const ecommerceSchema = new mongoose.Schema({
  status: { type: Boolean, default: false },
  storeDescription: { type: String },
  storeBanner: { type: String },
});

const servicesSchema = new mongoose.Schema({
  loyalty: { type: Boolean, default: true },
  reservation: { type: Boolean, default: false },
  ecommerce: { type: ecommerceSchema, default: () => ({}) },
  games: { type: Boolean, default: false },
  share: { type: Boolean, default: false },
});

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    logo: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    pin: {
      type: String,
      default: function () {
        return bcrypt.hashSync("1234", 10);
      },
    },
    email: { type: String },
    pass: { type: String },
    smsToken: { type: String },
    loyaltyCard: { type: Object, default: {} },
    services: { type: servicesSchema, default: () => ({}) },
    type: {
      type: String,
      enum: ["retail", "food", "service"],
      required: true,
      default: "retail",
    },
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

module.exports = mongoose.model("Store", storeSchema);
