import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import smsFeeModel from "../models/smsFeeModel.js";

export default class AdminController {
  async registerUser(req, res) {
    try {
      const { email, password, confirm_password } = req.body.newUser;
      console.log(email);

      console.log(req.body);

      if (!email || !password || !confirm_password) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }

      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.json({
          success: false,
          message: "User already exists with this email address",
        });
      }

      if (password === confirm_password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await userModel.create({
          email,
          password: hashedPassword,
        });
        console.log(newUser);
        newUser = await userModel.findById(newUser._id).select("-password");
        console.log(newUser);
        res.status(200).json({
          success: true,
          message: "User Registered Successful",
          userData: newUser,
        });
      } else {
        return res.json({ success: false, message: "Password didn't match" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async fetchUsers(req, res) {
    try {
      // Find all users where role is 'user'
      const users = await userModel.find({ role: "user" });

      // Respond with the list of users
      return res.status(200).json({ success: true, users });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  async fetchMessages(req, res) {
    try {
      const messages = await messageModel
        .find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "email");
      console.log(messages);

      return res.status(200).json({ success: true, messages });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  async changeMessageStatus(req, res) {
    try {
      const { messageId, status } = req.body;
      let updatedMessage = await messageModel.findByIdAndUpdate(messageId, {
        status,
      });
      console.log(updatedMessage);
      updatedMessage = await messageModel.populate(updatedMessage, {
        path: "createdBy",
        select: "email",
      });
      return res.json({
        success: true,
        message: "Message Status Updated Successfuly",
        updatedMessage,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async changeSMSFee(req, res) {
    try {
      const { fee } = req.body;
      if (!fee || fee <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid fee amount." });
      }

      let smsFee = await smsFeeModel.findOne();
      if (!smsFee) {
        smsFee = new smsFeeModel();
      }

      smsFee.amount = fee;

      await smsFee.save();
      res.json({ success: true, message: "SMS fee updated successfully." });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
