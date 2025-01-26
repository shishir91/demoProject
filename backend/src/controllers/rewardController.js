import rewardModel from "../models/rewardModel.js";
import storeModel from "../models/storeModel.js";

export default class RewardController {
  async createReward(req, res) {
    try {
      const { storeId } = req.query;
      const { name, expiry, validity, points, evergreen } = req.body;
      console.log(req.body);

      if (!name || !validity || !points) {
        return res.json({ success: false, message: "All fields are required" });
      }
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        console.log("access granted");

        const reward = await rewardModel.create({
          ...req.body,
        });
        return res.json({
          success: true,
          message: "Reward Saved",
          reward,
        });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async getRewards(req, res) {
    try {
      const { storeId } = req.params;
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        console.log(store);

        const rewards = await rewardModel.find({ store: store._id });
        console.log(rewards);

        return res.json({ success: true, rewards });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async editReward(req, res) {
    try {
      const { rewardId } = req.query;
      const { storeId } = req.params;
      console.log(req.body);

      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      const reward = await rewardModel.findById(rewardId);
      if (!reward) {
        return res.json({ success: false, message: "Cannot find the reward" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        // console.log(store);

        const rewards = await rewardModel.findByIdAndUpdate(
          rewardId,
          { ...req.body },
          { new: true }
        );
        // console.log(rewards);

        return res.json({ success: true, message: "Reward Saved", rewards });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
