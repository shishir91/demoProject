import { Router } from "express";
import CustomerController from "../controllers/customerController.js";

const router = Router();

const customerController = new CustomerController();

//forDemoProject
router.post("/register", customerController.register);

export default router;
