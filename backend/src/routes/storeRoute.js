import { Router } from "express";
import StoreController from "../controllers/storeController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";
import MailSMSController from "../controllers/mailSMSController.js";

const router = new Router();

const storeController = new StoreController();
const mailSMSController = new MailSMSController();

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

//USER CONTROL
router.post("/verifyPIN/:storeURL", storeController.verifyPIN);
router.get("/checkStore/:storeURL", storeController.checkStore);
router.put("/changePoints/:storeURL", storeController.changePoints);
router.get("/getPointsDetail/:storeURL", storeController.getPointsDetail);
router.get("/myStores", authMiddleware, storeController.getMyStore);
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

export default router;
