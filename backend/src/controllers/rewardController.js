// import rewardModel from "../models/rewardModel.js";
// import storeModel from "../models/storeModel.js";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
const rewardModel = require("../models/rewardModel");
const storeModel = require("../models/storeModel");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class RewardController {
  async createReward(req, res) {
    try {
      const { storeId } = req.query;
      const { name, expiry, validity, points, evergreen } = req.body;

      if (!name || !validity || !points) {
        return res.json({ success: false, message: "All fields are required" });
      }
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
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
      const rewards = await rewardModel
        .find({ store: store._id })
        .populate("store", "name");
      for (const reward of rewards) {
        if (reward.template.image.startsWith("https://")) {
          continue;
        }
        const getObjectParams = {
          Bucket: "samparkabucket",
          Key: reward.template.image,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        reward.template.image = url;
      }
      return res.json({ success: true, rewards });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async editReward(req, res) {
    try {
      const { rewardId } = req.query;
      const { storeId } = req.params;

      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }

      const reward = await rewardModel.findById(rewardId);
      if (!reward) {
        return res.json({ success: false, message: "Cannot find the reward" });
      }

      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        if (req.file) {
          const oldLogoKey = reward.template.image;

          // Skip deletion if the key starts with "https://"
          if (oldLogoKey && !oldLogoKey.startsWith("https://")) {
            const deleteObjectParams = {
              Bucket: "samparkabucket",
              Key: oldLogoKey,
            };
            const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
            await s3.send(deleteCommand);
          }

          // S3 upload
          const imageName = Date.now().toString() + "-" + req.file.originalname;
          const putObjectParams = {
            Bucket: "samparkabucket",
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          };
          const putCommand = new PutObjectCommand(putObjectParams);
          await s3.send(putCommand);

          reward.template.image = imageName;
          await reward.save();
        }

        // Update reward with the new image in the template
        const updatedReward = await rewardModel
          .findByIdAndUpdate(rewardId, { ...req.body }, { new: true })
          .populate("store", "name");

        return res.json({
          success: true,
          message: "Reward Saved",
          reward: updatedReward,
        });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async deleteReward(req, res) {
    try {
      const { rewardID } = req.params;
      const reward = await rewardModel.findById(rewardID).populate("store");

      if (!reward) {
        return res.json({ success: false, message: "Cannot find the reward" });
      }
      if (req.user.role == "admin" || req.user.id == reward.store.user[0]) {
        const deleteObjectParams = {
          Bucket: "samparkabucket",
          Key: reward.template.image,
        };
        const command = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(command);
        const deleteReward = await rewardModel.findByIdAndDelete(rewardID);
        if (deleteReward) {
          await redemptionModel.deleteMany({ reward: rewardID });
          console.log("Related redemptions deleted.");
        } else {
          console.log("Reward not found.");
        }
        return res.json({
          success: true,
          message: "Reward Deleted Successfully",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}

module.exports = new RewardController();
