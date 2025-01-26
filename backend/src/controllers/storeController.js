// import loyalityModel from "../models/loyalityModel.js";
import storeModel from "../models/storeModel.js";
import pointsModel from "../models/pointsModel.js";
import userModel from "../models/userModel.js";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import customerModel from "../models/customerModel.js";
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default class StoreController {
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
      console.log(req.body);
      const { name, location, phone, url, user } = req.body;
      if (!req.file || !name || !location || !phone || !url || !user) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (/[^a-z0-9.-]/.test(url)) {
        return res.json({ success: false, message: "Invalid URL" });
      }
      const checkStore = await storeModel.find({ url });
      console.log(checkStore);
      if (checkStore.length > 0) {
        return res.json({ success: false, message: "URL already taken" });
      }
      const imageUrl = req.file ? req.file.key : null;
      console.log(req.body.formData);
      const store = await storeModel.create({
        ...req.body,
        logo: imageUrl,
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
      }

      return res.json({ success: true, stores });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async getMyStore(req, res) {
    try {
      console.log(req.user);

      const stores = await storeModel.find({ user: req.user });
      for (const store of stores) {
        const getObjectParams = {
          Bucket: "samparkabucket",
          Key: store.logo,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        store.logo = url;
      }
      return res.json({ success: true, stores });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async editStore(req, res) {
    try {
      const { storeId } = req.query;
      console.log(req.body);

      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
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
      console.log(storeId);

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
        console.log(deleteStore);

        return res.json({
          success: true,
          message: "Store Deleted Successfully",
        });
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

  //POINTS
  async changePoints(req, res) {
    try {
      const { storeURL } = req.params;
      console.log(storeURL);
      const store = await storeModel.findOne({ url: storeURL });
      console.log(store._id);
      const { points } = req.body;
      console.log(points);
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
      console.log(storeURL);
      const store = await storeModel.findOne({ url: storeURL });
      console.log(store);
      const points = await pointsModel.findOne({ store });
      console.log(points);

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
      console.log(customers);
      return res.json({ success: true, customers });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  }
}
