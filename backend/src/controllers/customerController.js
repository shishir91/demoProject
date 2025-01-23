import generateToken from "../config/generateToken.js";
import customerModel from "../models/customerModel.js";
import pointsModel from "../models/pointsModel.js";
import storeModel from "../models/storeModel.js";
import SmsController from "./smsController.js";
import validator from "validator";

const smsController = new SmsController();

export default class CustomerController {
  //Customer Register
  register = async (req, res) => {
    try {
      let { name, email, phone } = req.body;
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });

      if (!email || !name || !phone) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }

      console.log(store, email, phone);

      // Check if a customer already exists in the specific store
      const existingCustomer = await customerModel.findOne({
        store,
        email,
        phone,
      });

      if (existingCustomer) {
        console.log("yes");

        // If customer exists, send OTP and return login response
        const smsResponse = await smsController.sendOTP(phone);
        if (smsResponse.success) {
          return res.json({
            success: true,
            message: "Login Successful. OTP has been sent",
            customer: existingCustomer,
            token: generateToken(existingCustomer._id),
          });
        } else {
          return res.json({
            success: true,
            message: "Login Successful. Failed to send OTP",
            customer: existingCustomer,
            token: generateToken(existingCustomer._id),
          });
        }
      }

      // Create a new customer if not already exists
      const customer = await customerModel.create({
        name,
        email,
        phone,
        store,
      });

      if (customer) {
        const updatedCustomer = await this.getOnePoint(customer._id);
        const smsResponse = await smsController.sendOTP(phone);
        console.log(smsResponse);

        if (smsResponse.success) {
          return res.json({
            success: true,
            message: "Registration Successful. OTP has been sent",
            customer: updatedCustomer,
            token: generateToken(customer._id),
          });
        } else {
          return res.json({
            success: true,
            message: "Registration Successful. Failed to send OTP",
            customer: updatedCustomer,
            token: generateToken(customer._id),
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Registration Failed",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

  //CUSTOMER GET LOYALTY CARD DATA
  async getLoyaltyCardData(req, res) {
    try {
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });
      return res.json({ success: true, cardData: store.loyaltyCard });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  //GET CUSTOMER DATA
  async getCustomerData(req, res) {
    try {
      const customer = await customerModel.findById(req.user);
      return res.send(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  //CUSTOMER GET POINTS
  async getPoints(req, res) {
    try {
      console.log(req.params);

      const { pointsId } = req.params;
      if (pointsId) {
        const points = await pointsModel.findById(pointsId);
        if (points) {
          const receivedPoints = points.points;
          const customer = await customerModel.findByIdAndUpdate(
            req.user,
            { $inc: { points: receivedPoints } },
            { new: true }
          );
          const resetPoints = await pointsModel.findByIdAndUpdate(pointsId, {
            points: 0,
          });
          return res.json({
            success: true,
            message: `Congratulation. You have received ${receivedPoints} points`,
            customer,
            points: receivedPoints,
          });
        } else {
          return res.json({ success: false, message: "No Points Found" });
        }
      } else {
        return res.json({ success: false, message: "No Points Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  getOnePoint = async (customerId) => {
    try {
      const customer = await customerModel.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const updatedCustomer = await customerModel.findByIdAndUpdate(
        customerId,
        { points: customer.points + 1 },
        { new: true }
      );

      return updatedCustomer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
