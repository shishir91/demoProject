import { Router } from "express";
import StoreController from "../controllers/storeController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

const storeController = new StoreController();

router.get("/", adminMiddleware, storeController.getAllStores);
router.post("/addStore", adminMiddleware, storeController.createStore);
router.get("/myStores", authMiddleware, storeController.getMyStore);
router.put("/editStore", authMiddleware, storeController.editStore);
router.put("/changeStoreStatus/:storeId", authMiddleware, storeController.editStoreStatus);
router.delete("/deleteStore", adminMiddleware, storeController.deleteStore);

//loyalitycard
router.get("/getLoyalityCard", authMiddleware, storeController.getLoyalityCard);
router.put("/loyalityCard", authMiddleware, storeController.createOrEditLoyalityCard);

export default router;
