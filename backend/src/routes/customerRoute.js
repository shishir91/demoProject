import { Router } from "express";
import customerMiddleware from "../middlewares/customerMiddleware.js";
import CustomerController from "../controllers/customerController.js";

const router = Router();

const customerController = new CustomerController();

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

export default router;
