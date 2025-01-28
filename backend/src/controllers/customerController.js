import generateToken from "../config/generateToken.js";
import customerModel from "../models/customerModel.js";
import pointsModel from "../models/pointsModel.js";
import storeModel from "../models/storeModel.js";
import MailController from "./mailController.js";
import SmsController from "./smsController.js";
import validator from "validator";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import rewardModel from "../models/rewardModel.js";
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const smsController = new SmsController();
const mailController = new MailController();

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
        phone,
      });

      if (existingCustomer) {
        console.log("yes");
        return res.json({
          success: true,
          message: "Login Successful",
          customer: existingCustomer,
          token: generateToken(existingCustomer._id),
        });
        // If customer exists, send OTP and return login response
        // const smsResponse = await smsController.sendOTP(phone);
        // if (smsResponse.success) {
        //   return res.json({
        //     success: true,
        //     message: "Login Successful. OTP has been sent",
        //     customer: existingCustomer,
        //     token: generateToken(existingCustomer._id),
        //   });
        // } else {
        //   return res.json({
        //     success: true,
        //     message: "Login Successful. Failed to send OTP",
        //     customer: existingCustomer,
        //     token: generateToken(existingCustomer._id),
        //   });
        // }
      }

      // Create a new customer if not already exists
      const customer = await customerModel.create({
        name,
        email,
        phone,
        store,
      });

      if (customer) {
        const updatedCustomer = await this.getOnePoint(customer._id, storeURL);
        // const smsResponse = await smsController.sendOTP(phone);
        // console.log(smsResponse);
        // if (smsResponse.success) {
        //   return res.json({
        //     success: true,
        //     message: "Registration Successful. OTP has been sent",
        //     customer: updatedCustomer,
        //     token: generateToken(customer._id),
        //   });
        // } else {
        //   return res.json({
        //     success: true,
        //     message: "Registration Successful. Failed to send OTP",
        //     customer: updatedCustomer,
        //     token: generateToken(customer._id),
        //   });
        // }
        return res.json({
          success: true,
          message: "Registration Successful.",
          customer: updatedCustomer,
          token: generateToken(customer._id),
        });
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
      const getObjectParams = {
        Bucket: "samparkabucket",
        Key: store.logo,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      store.logo = url;
      return res.json({ success: true, store });
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
      if (!req.user) {
        return res.json({ success: false });
      }
      const { pointsId } = req.params;
      if (pointsId) {
        const points = await pointsModel.findById(pointsId);
        if (points) {
          if (points.points !== 0) {
            const receivedPoints = points.points;
            const customer = await customerModel
              .findByIdAndUpdate(
                req.user,
                { $inc: { points: receivedPoints } },
                { new: true }
              )
              .populate("store", "email pass url");
            await pointsModel.findByIdAndUpdate(pointsId, {
              points: 0,
            });
            await mailController.mailCustomers(
              customer.store.email,
              customer.store.pass,
              customer.email,
              receivedPoints,
              customer.store.url
            );
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
      } else {
        return res.json({ success: false, message: "No Points Found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  getOnePoint = async (customerId, storeURL) => {
    try {
      console.log("Function Called");

      const customer = await customerModel.findById(customerId);
      if (!customer) {
        throw new Error("Customer not found");
      }

      const updatedCustomer = await customerModel.findByIdAndUpdate(
        customerId,
        { points: customer.points + 1 },
        { new: true }
      );

      console.log(storeURL);
      const store = await storeModel
        .findOne({ url: storeURL })
        .select("email pass");
      console.log(store);

      const mailResponse = await mailController.mailCustomers(
        store.email,
        store.pass,
        customer.email,
        1,
        storeURL
      );
      console.log(mailResponse);

      return updatedCustomer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  //CUSTOMER REDEEM REWARD
  async redeemReward(req, res) {
    try {
      const { rewardID } = req.params;
      // req.user
      const reward = await rewardModel.findById(rewardID);
      if (!reward) {
        return res.json({ success: false, message: "Reward not found" });
      }
      const customer = await customerModel.findById(req.user);
      if (customer.points < reward.points) {
        return res.json({ success: false, message: "Not enough points" });
      }
      if (customer.rewards.includes(rewardID)) {
        return res.json({ success: false, message: "Reward already redeemed" });
      }

      const redeemReward = await customerModel.findByIdAndUpdate(
        req.user,
        {
          $inc: { points: -reward.points },
          $push: { rewards: rewardID },
        },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Reward redeemed successful",
        redeemReward,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
