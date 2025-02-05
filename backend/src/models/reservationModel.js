// import mongoose from "mongoose";
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    tableNumber: { type: String, required: true },
    numberofGuests: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// export default mongoose.model("Reservation", reservationSchema);
module.exports = mongoose.model("Reservation", reservationSchema);
