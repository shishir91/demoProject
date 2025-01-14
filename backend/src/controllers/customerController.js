import generateToken from "../config/generateToken.js";
import customerModel from "../models/customerModel.js";

export default class CustomerController {
  //Customer Register
  async register(req, res) {
    try {
      let { countryCode, name, email, phone } = req.body;
      console.log(phone);

      const customer = await customerModel.create({ name, email, phone });

      if (customer) {
        return res.json({
          success: true,
          message: "Registration Successful",
          customer,
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
  }
}
