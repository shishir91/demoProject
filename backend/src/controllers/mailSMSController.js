// import mailSMSModel from "../models/mailSMSModel.js";
// import storeModel from "../models/storeModel.js";
const mailSMSModel = require("../models/mailSMSModel");
const storeModel = require("../models/storeModel");
const validator = require("validator");

class MailSMSController {
  async configMessage(req, res) {
    try {
      const { storeID } = req.params;
      const { status } = req.body;
      const store = await storeModel.findById(storeID);
      if (!store) {
        return res.json({ success: false, message: "Store Not Found" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        let mailSMS;
        switch (status) {
          case "afterLogin":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { mailAfterLogin: { ...req.body } },
              { new: true }
            );
            break;
          case "afterPointEarned":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { mailAfterPointEarned: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { mailAfterRewardRedeemed: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed_admin":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { mailAfterRewardRedeemed_Admin: { ...req.body } },
              { new: true }
            );
            break;
          default:
            break;
        }

        return res.json({ success: true, message: "Message Saved", mailSMS });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async getConfigMessage(req, res) {
    try {
      const { storeID } = req.params;
      const store = await storeModel.findById(storeID);
      if (!store) {
        return res.json({ success: false, message: "Store Not Found" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        const mailSMS = await mailSMSModel.findOne({ store });
        return res.json({ success: true, mailSMS });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async getConfigSMS(req, res) {
    try {
      const { storeID } = req.params;
      const store = await storeModel.findById(storeID);
      if (!store) {
        return res.json({ success: false, message: "Store Not Found" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        const mailSMS = await mailSMSModel.findOne({ store });
        return res.json({ success: true, mailSMS });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async configSMSMessage(req, res) {
    try {
      const { storeID } = req.params;
      const { status, to } = req.body;
      const store = await storeModel.findById(storeID);
      if (!store) {
        return res.json({ success: false, message: "Store Not Found" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        if (to) {
          if (!validator.isMobilePhone("+977" + to, "ne-NP")) {
            return res.json({
              success: false,
              message: "Invalid Phone Number",
            });
          }
        }
        let mailSMS;
        switch (status) {
          case "afterLogin":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { smsAfterLogin: { ...req.body } },
              { new: true }
            );
            break;
          case "afterPointEarned":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { smsAfterPointEarned: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { smsAfterRewardRedeemed: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed_admin":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { smsAfterRewardRedeemed_Admin: { ...req.body } },
              { new: true }
            );
            break;
          default:
            break;
        }

        return res.json({ success: true, message: "Message Saved", mailSMS });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}

module.exports = new MailSMSController();
