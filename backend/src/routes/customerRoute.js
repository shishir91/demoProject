import { Router } from "express";
import customerMiddleware from "../middlewares/customerMiddleware.js";
import CustomerController from "../controllers/customerController.js";

const router = Router();

const customerController = new CustomerController();

//forDemoProject
router.post("/register", customerController.register);
router.put(
  "/getPoints/:pointsId",
  customerMiddleware,
  customerController.getPoints
);

export default router;
