import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import storeRoute from "./routes/storeRoute.js";
import rewardRoute from "./routes/rewardRoute.js";
import customerRoute from "./routes/customerRoute.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://www.samparka.co:443", "https://samparka.co:443"]
        : "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
  })
);

app.post("/api/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  const payload = {
    token: process.env.SPARROW_SMS_TOKEN,
    from: "TheAlert", // Replace with your approved sender ID
    to: phoneNumber,
    text: `Hello, welcome to our service! Your OTP is 123456.`,
  };

  console.log(payload);

  try {
    const response = await axios.post(
      "https://api.sparrowsms.com/v2/sms/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.response_code === 200) {
      return res
        .status(200)
        .json({ success: true, message: "SMS sent successfully" });
    } else {
      return res
        .status(500)
        .json({ error: "SMS API response error", details: response.data });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Error sending SMS",
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.use("/customer", customerRoute);
app.use("/reward", rewardRoute);
app.use("/store", storeRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Server is Running...." + process.env.CLIENT_ORIGIN);
});

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server is Running in http://localhost:${port}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODBCONNECTIONSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit();
  }
});
