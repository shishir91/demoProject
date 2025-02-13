// import express from "express";
// import "dotenv/config";
// import mongoose from "mongoose";
// import cors from "cors";
// import bcrypt from "bcrypt";
// import userRoute from "./routes/userRoute.js";
// import adminRoute from "./routes/adminRoute.js";
// import storeRoute from "./routes/storeRoute.js";
// import rewardRoute from "./routes/rewardRoute.js";
// import customerRoute from "./routes/customerRoute.js";
// import manifestRoute from "./routes/manifestRoute.js";
// import storeModel from "./models/storeModel.js";
// import rewardModel from "./models/rewardModel.js";
const express = require("express");
require("dotenv/config");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const storeRoute = require("./routes/storeRoute");
const rewardRoute = require("./routes/rewardRoute");
const customerRoute = require("./routes/customerRoute");
const manifestRoute = require("./routes/manifestRoute");
const storeModel = require("./models/storeModel");
const rewardModel = require("./models/rewardModel");
const productRoute = require("./routes/productRoute");
const ecomRoute = require("./routes/ecomRoute");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins =
        process.env.NODE_ENV === "production"
          ? ["https://samparka.co", "https://www.samparka.co"]
          : [
              "http://localhost:5173", // Direct match
            ];

      let dynamicLocalhostRegex;
      process.env.NODE_ENV === "production"
        ? (dynamicLocalhostRegex = /^https:\/\/[a-z0-9-]+\.samparka.co$/)
        : (dynamicLocalhostRegex = /^http:\/\/[a-z0-9-]+\.localhost:5173$/);

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        dynamicLocalhostRegex.test(origin)
      ) {
        // Allow the request
        callback(null, true);
      } else {
        // Deny the request
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies and credentials
  })
);

app.use("/", manifestRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/store", storeRoute);
app.use("/reward", rewardRoute);
app.use("/customer", customerRoute);
app.use("/product", productRoute);
app.use("/ecom",ecomRoute);

app.get("/", (req, res) => {
  res.send("Server is Running...." + process.env.CLIENT_ORIGIN);
});

const port = process.env.PORT || 8000;

// Function to connect to MongoDB
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODBCONNECTIONSTRING);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Run migration after connecting
    await runMigration();
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Stop the app if connection fails
  }
}

// Migration function
async function runMigration() {
  try {
    await storeModel.updateMany(
      {},
      { $set: { owner: "Unknown", establishedYear: 2000 } }
    );
    console.log("✅ Migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  }
}

// Start the app after database connection
async function startServer() {
  await connectDB();
  await storeModel.findByIdAndUpdate(
    "67a0622b07928e9c422ed5a1",
    { pin: bcrypt.hashSync("1234", 10) },
    { new: true }
  );
  app.listen(port, () => {
    console.log(`🚀 Server is Running at http://localhost:${port}`);
  });
}

// Run the server
startServer();
