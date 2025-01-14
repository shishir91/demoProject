import loyalityModel from "../models/loyalityModel.js";
import storeModel from "../models/storeModel.js";

export default class StoreController {
  async createStore(req, res) {
    try {
      console.log(req.body.formData);
      const store = await storeModel.create(req.body.formData);
      return res.json({ success: true, message: "New Store Created", store });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async getAllStores(req, res) {
    try {
      const stores = await storeModel.find();
      return res.json({ success: true, stores });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  async getMyStore(req, res) {
    try {
      console.log(req.body.formData);
      const store = await storeModel.find({ user: req.user });
      return res.json({ success: true, store });
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

  //Loyality Card APISSS
  async getLoyalityCard(req, res) {
    try {
      console.log(req.user);
      console.log(req.query);
      const { storeId } = req.query;
      console.log(req.body);

      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        console.log("access granted");
        const loyalityCard = await loyalityModel.find({ store });
        console.log(loyalityCard);

        if (loyalityCard || loyalityCard.length > 0) {
          return res.json({ success: true, loyalityCard });
        }
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }

  async createOrEditLoyalityCard(req, res) {
    try {
      console.log(req.user);
      console.log(req.query);
      console.log(req.body);
      const { storeId } = req.query;
      let loyalityCard;

      const store = await storeModel.findById(storeId);
      if (!store) {
        return res.json({ success: false, message: "Cannot find the store" });
      }
      if (req.user.role == "admin" || req.user.id == store.user[0]) {
        console.log("access granted");
        loyalityCard = await loyalityModel.find({ store });

        if (!loyalityCard || loyalityCard.length < 1) {
          console.log("Create Loyality Card");
          const newLoyalityCard = await loyalityModel.create({
            ...req.body,
            store,
          });
          return res.json({
            success: true,
            message: "Loyality Card Saved",
            newLoyalityCard,
          });
        } else {
          console.log("Edit Loyality Card");

          const newLoyalityCard = await loyalityModel.findByIdAndUpdate(
            loyalityCard[0]._id,
            { ...req.body },
            { new: true }
          );
          console.log(newLoyalityCard);

          return res.json({
            success: true,
            message: "Loyality Card Saved",
            newLoyalityCard,
          });
        }
      } else {
        return res.json({ success: false, message: "You don't have access" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  }
}
