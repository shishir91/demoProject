import axios from "axios";

export default class SmsController {
  async sendOTP(req, res) {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }

    const payload = {
      token: process.env.SPARROW_SMS_TOKEN,
      from: "TheAlert",
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
  }
}
