import generateToken from "../config/generateToken.js";
import customerModel from "../models/customerModel.js";
import pointsModel from "../models/pointsModel.js";
import SmsController from "./smsController.js";

const smsController = new SmsController();

export default class CustomerController {
  //Customer Register
  async register(req, res) {
    try {
      let { countryCode, name, email, phone } = req.body;
      console.log(phone);

      const customer = await customerModel.create({ name, email, phone });

      if (customer) {
        const smsResponse = await smsController.sendOTP(phone);
        if (smsResponse.success) {
          return res.json({
            success: true,
            message: "Registration Successful. OTP has been sent",
            customer,
            token: generateToken(customer._id),
          });
        } else {
          return res.json({
            success: true,
            message: "Registration Successful. Failed to send OTP",
            customer,
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
  }

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
          return res.json({
            success: true,
            message: `congratulation. You have received ${receivedPoints} points`,
            customer,
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
}