import { Router } from "express";
import customerMiddleware from "../middlewares/customerMiddleware.js";
import CustomerController from "../controllers/customerController.js";

const router = Router();

const customerController = new CustomerController();

router.get("/", customerMiddleware, customerController.getCustomerData);
router.post("/register/:storeURL", customerController.register);

router.get(
  "/loyaltyCard/:storeURL",
  customerMiddleware,
  customerController.getLoyaltyCardData
);

router.put(
  "/getPoints/:pointsId",
  customerMiddleware,
  customerController.getPoints
);

router.get("/store/:storeURL", customerController.getStoreData);
router.get("/myRewards", customerMiddleware, customerController.getMyRewards);
router.put(
  "/redeemReward/:rewardID",
  customerMiddleware,
  customerController.redeemReward
);
router.get(
  "/getReservations",
  customerMiddleware,
  customerController.getReservations
);
router.post("/reservation/:storeURL", customerMiddleware, customerController.reservation);

export default router;
