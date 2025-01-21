import { Router } from "express";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = Router();

const adminController = new AdminController();

router.post("/createUser", adminMiddleware, adminController.registerUser);
router.get("/getUsers", adminMiddleware, adminController.fetchUsers);
router.get("/getMessages", adminMiddleware, adminController.fetchMessages);
router.put("/changeSMSFee", adminMiddleware, adminController.changeSMSFee);
router.put(
  "/changeMessageStatus",
  adminMiddleware,
  adminController.changeMessageStatus
);

export default router;
