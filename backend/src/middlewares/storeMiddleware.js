// import jwt from "jsonwebtoken";
// import userModel from "../models/userModel.js";
const jwt = require("jsonwebtoken");
const storeModel = require("../models/storeModel");

module.exports = async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ success: false, message: "Invalid Token" });
        }
        req.store = await storeModel.findById(decoded.id);
        next();
      });
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Token Verification Failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Token Not Provided" });
  }
};
