// import { Router } from "express";
// import StoreController from "../controllers/storeController.js";
// import adminMiddleware from "../middlewares/adminMiddleware.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
// import multer from "multer";
// import MailSMSController from "../controllers/mailSMSController.js";
const { Router } = require("express");
const storeController = require("../controllers/storeController");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const mailSMSController = require("../controllers/mailSMSController");
const storeMiddleware = require("../middlewares/storeMiddleware");

const router = new Router();

// const storeController = new StoreController();
// const mailSMSController = new MailSMSController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//ADMIN CONTROL
router.get("/", adminMiddleware, storeController.getAllStores);
router.delete("/deleteStore", adminMiddleware, storeController.deleteStore);
router.post(
  "/addStore",
  adminMiddleware,
  upload.single("image"),
  storeController.createStore
);
router.put(
  "/editServices/:storeID",
  adminMiddleware,
  storeController.editStoreServices
);

//USER CONTROL
router.post("/verifyPIN/:storeURL", storeController.verifyPIN);
router.get("/checkStore/:storeURL", storeController.checkStore);
router.put("/changePoints/:storeURL", storeController.changePoints);
router.get("/getPointsDetail/:storeURL", storeController.getPointsDetail);
router.get("/myStores", authMiddleware, storeController.getMyStore);

// for email setting
router.put("/config/:storeID", authMiddleware, storeController.configSMTP);
router.get(
  "/getMessage/:storeID",
  authMiddleware,
  mailSMSController.getConfigMessage
);
router.put(
  "/configMessage/:storeID",
  authMiddleware,
  mailSMSController.configMessage
);

// for sms setting
router.put("/configSMS/:storeID", authMiddleware, storeController.configSMS);
router.get("/getSMS/:storeID", authMiddleware, mailSMSController.getConfigSMS);
router.put(
  "/configSMSMessage/:storeID",
  authMiddleware,
  mailSMSController.configSMSMessage
);

router.put(
  "/editStore",
  authMiddleware,
  upload.single("image"),
  storeController.editStore
);
router.put(
  "/customizeLoyaltyCard",
  authMiddleware,
  upload.single("image"),
  storeController.customizeLoyaltyCard
);
router.put(
  "/changeStoreStatus/:storeId",
  authMiddleware,
  storeController.editStoreStatus
);
router.get(
  "/getCustomers/:storeID",
  authMiddleware,
  storeController.getCustomers
);
router.post(
  "/createCustomer/:storeID",
  authMiddleware,
  storeMiddleware,
  storeController.createCustomer
);
router.put("/givePoints/:storeID", authMiddleware, storeController.givePoints);
router.get("/getRedeemedRewards/:storeURL", storeController.getRedeemedRewards);
router.put("/claimReward/:storeURL", storeController.claimReward);

// export default router;
module.exports = router;
