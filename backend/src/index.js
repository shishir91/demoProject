import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import storeRoute from "./routes/storeRoute.js";
import rewardRoute from "./routes/rewardRoute.js";
import customerRoute from "./routes/customerRoute.js";
import manifestRoute from "./routes/manifestRoute.js";

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
