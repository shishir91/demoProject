import mailSMSModel from "../models/mailSMSModel.js";
import storeModel from "../models/storeModel.js";

export default class MailSMSController {
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
              { messageAfterLogin: { ...req.body } },
              { new: true }
            );
            break;
          case "afterPointEarned":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { messageAfterPointEarned: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { messageAfterRewardRedeemed: { ...req.body } },
              { new: true }
            );
            break;
          case "afterRewardRedeemed_admin":
            mailSMS = await mailSMSModel.findOneAndUpdate(
              { store },
              { messageAfterRewardRedeemed_Admin: { ...req.body } },
              { new: true }
            );
            break;
          default:
            break;
        }
        console.log(mailSMS);

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
}
