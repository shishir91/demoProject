// import loyalityModel from "../models/loyalityModel.js";
// import storeModel from "../models/storeModel.js";
// import pointsModel from "../models/pointsModel.js";
// import customerModel from "../models/customerModel.js";
// import redemptionModel from "../models/redemptionModel.js";
// import bcrypt from "bcrypt";
// import validator from "validator";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import {
//   S3Client,
//   GetObjectCommand,
//   PutObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import mailSMSModel from "../models/mailSMSModel.js";
// import messageModel from "../models/messageModel.js";
const storeModel = require("../models/storeModel.js");
const pointsModel = require("../models/pointsModel.js");
const customerModel = require("../models/customerModel.js");
const redemptionModel = require("../models/redemptionModel.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const mailSMSModel = require("../models/mailSMSModel.js");
const messageModel = require("../models/messageModel.js");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

class StoreController {
  async checkStore(req, res) {
    try {
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });

      if (store && store.status == "active") {
        return res.json({ success: true, message: "Store Available" });
      } else {
        return res.json({ success: false, message: "Store UnAvailable" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async createStore(req, res) {
    try {
      const { name, location, phone, url, user } = req.body;
      if (!req.file || !name || !location || !phone || !url || !user) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (/[^a-z0-9.-]/.test(url)) {
        return res.json({ success: false, message: "Invalid URL" });
      }
      const checkStore = await storeModel.find({ url });
      if (checkStore.length > 0) {
        return res.json({ success: false, message: "URL already taken" });
      }
      // S3 upload
      let imageName = Date.now().toString() + "-" + req.file.originalname;
      const putObjectParams = {
        Bucket: "samparkabucket",
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const command = new PutObjectCommand(putObjectParams);
      await s3.send(command);
      const store = await storeModel.create({
        ...req.body,
        logo: imageName,
        user,
      });
      await pointsModel.create({ store });
      return res.json({ success: true, message: "New Store Created", store });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async getAllStores(req, res) {
    try {
      const stores = await storeModel.find();

      for (const store of stores) {
        const getObjectParams = {
          Bucket: "samparkabucket",
          Key: store.logo,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        store.logo = url;
        if (store.loyaltyCard.customStamp) {
          const getObjectParams1 = {
            Bucket: "samparkabucket",
            Key: store.loyaltyCard.customStamp,
          };
          const command1 = new GetObjectCommand(getObjectParams1);
          const url1 = await getSignedUrl(s3, command1, { expiresIn: 3600 });
          store.loyaltyCard.customStamp = url1;
        } else {
          store.loyaltyCard.customStamp = null; // or set a default value
        }
      }

      return res.json({ success: true, stores });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async getMyStore(req, res) {
    try {
      const stores = await storeModel.find({ user: req.user });
      for (const store of stores) {
        const getObjectParams = {
          Bucket: "samparkabucket",
          Key: store.logo,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        store.logo = url;
        if (store.loyaltyCard.customStamp) {
          const getObjectParams1 = {
            Bucket: "samparkabucket",
            Key: store.loyaltyCard.customStamp,
          };
          const command1 = new GetObjectCommand(getObjectParams1);
          const url1 = await getSignedUrl(s3, command1, { expiresIn: 3600 });
          store.loyaltyCard.customStamp = url1;
        } else {
          store.loyaltyCard.customStamp = null; // or set a default value
        }
      }
      return res.json({ success: true, stores });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async customizeLoyaltyCard(req, res) {
    try {
      const { storeId } = req.query;
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        if (req.file) {
          const oldLogoKey = store.loyaltyCard.customStamp;
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

          store.loyaltyCard.customStamp = imageName;
          await store.save();
        }

        Object.assign(store.loyaltyCard, req.body);

        await store.save();

        return res.json({
          success: true,
          message: "Loyalty Card Saved",
          store,
        });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async editStore(req, res) {
    try {
      const { storeId } = req.query;
      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        if (req.file) {
          const oldLogoKey = store.logo;
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

          store.logo = imageName;
          await store.save();
        }

        const newStore = await storeModel.findByIdAndUpdate(
          storeId,
          { ...req.body },
          { new: true }
        );
        return res.json({ success: true, message: "Store Updated", newStore });
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async deleteStore(req, res) {
    try {
      const { storeId } = req.query;

      const store = await storeModel.findById(storeId);

      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        const deleteObjectParams = {
          Bucket: "samparkabucket",
          Key: store.logo,
        };
        const command = new DeleteObjectCommand(deleteObjectParams);
        await s3.send(command);
        const deleteStore = await storeModel.findByIdAndDelete(storeId);

        return res.json({
          success: true,
          message: "Store Deleted Successfully",
        });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async editStoreStatus(req, res) {
    try {
      const { storeId } = req.params;
      const { status } = req.body;

      // Validate status value
      if (!["active", "deactive"].includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status value. Must be either 'active' or 'deactive'",
        });
      }

      // Find and update the store
      const store = await storeModel.findByIdAndUpdate(
        storeId,
        { status },
        { new: true }
      );

      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: `Store status updated to ${status}`,
        store,
      });
    } catch (error) {
      console.error("Error updating store status:", error);
      return res.status(500).json({
        success: false,
        message: "Error updating store status",
        error: error.message,
      });
    }
  }

  async configSMTP(req, res) {
    try {
      const { storeID } = req.params;
      const { email, pass } = req.body;
      const store = await storeModel.findById(storeID);
      if (!store) {
        return res.json({ success: false, message: "Store Not Found" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        const config = await storeModel.findByIdAndUpdate(
          storeID,
          { email, pass },
          { new: true }
        );
        const mailSMS = await mailSMSModel.findOne({ store });
        if (!mailSMS) {
          await mailSMSModel.create({ store });
        }
        await mailSMSModel.create();
        return res.json({
          success: true,
          message: "SMTP Configured Successfully.",
          config,
        });
      } else {
        return res.json({ success: false, message: "Access Denied" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  //STORE SIDE APIS
  async verifyPIN(req, res) {
    try {
      const { pin } = req.body;
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });
      if (!store) {
        return res.json({ success: false, message: "Store not found" });
      }
      if (store.pin && store.pin !== "1234") {
        const isPINValid = bcrypt.compareSync(pin, store.pin);
        if (!isPINValid) {
          return res.json({ success: false, message: "Invalid PIN" });
        }
      } else {
        if (pin !== "1234") {
          return res.json({ success: false, message: "Invalid PIN" });
        }
      }
      return res.json({ success: true, message: "PIN Verified" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
  async getRedeemedRewards(req, res) {
    try {
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });
      if (!store) {
        return res.json({ success: false, message: "Store not found" });
      }
      const redeemedRewards = await redemptionModel
        .find({ store })
        .populate("reward customer");

      if (redeemedRewards.length > 0) {
        await Promise.all(
          redeemedRewards.map(async (reward) => {
            if (reward.expiryDate <= reward.redeemDate) {
              reward.status = "expired";
              await reward.save();
            }
          })
        );
      }

      return res.json({ success: true, redeemedRewards });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
  async claimReward(req, res) {
    try {
      const { storeURL } = req.params;
      const { rewardID } = req.query;
      const store = await storeModel.findOne({ url: storeURL });
      const redemption = await redemptionModel.findById(rewardID);
      if (!store) {
        return res.json({ success: false, message: "Store not found" });
      }
      if (!redemption) {
        return res.json({ success: false, message: "Reward not found" });
      }
      if (redemption.status == "claimed") {
        return res.json({ success: false, message: "Reward already claimed" });
      }
      if (redemption.status == "expired") {
        return res.json({ success: false, message: "Reward Expired" });
      }
      if (redemption.expiryDate <= redemption.redeemDate) {
        redemption.status = "expired";
        await redemption.save();
        return res.json({ success: false, message: "Reward Expired" });
      }
      redemption.status = "claimed";
      await redemption.save();
      return res.json({ success: true, message: "Reward Claimed" });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  //POINTS
  async changePoints(req, res) {
    try {
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });
      const { points } = req.body;
      const changedPoints = await pointsModel.findOneAndUpdate(
        { store: store._id },
        { points },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Points Changed",
        changedPoints,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async getPointsDetail(req, res) {
    try {
      const { storeURL } = req.params;
      const store = await storeModel.findOne({ url: storeURL });
      const points = await pointsModel.findOne({ store });

      return res.json({
        success: true,
        points,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  //GET CUSTOMERS
  async getCustomers(req, res) {
    try {
      const { storeID } = req.params;
      const customers = await customerModel.find({ store: storeID });
      return res.json({ success: true, customers });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}

module.exports = new StoreController();