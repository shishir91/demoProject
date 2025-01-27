import { Router } from "express";
import StoreController from "../controllers/storeController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = new Router();

const storeController = new StoreController();

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
router.get("/checkStore/:storeURL", storeController.checkStore);
router.get("/getPointsDetail/:storeURL", storeController.getPointsDetail);
router.put("/changePoints/:storeURL", storeController.changePoints);
router.get("/myStores", authMiddleware, storeController.getMyStore);
router.put(
  "/editStore",
  authMiddleware,
  upload.single("image"),
  storeController.editStore
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
