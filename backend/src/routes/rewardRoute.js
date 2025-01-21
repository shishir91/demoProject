import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import RewardController from "../controllers/rewardController.js";

const router = new Router();

const rewardController = new RewardController();

router.post("/createReward", authMiddleware, rewardController.createReward);
router.get("/getRewards/:storeId", authMiddleware, rewardController.getRewards);
router.put(
  "/editReward/:storeId",
  authMiddleware,
  rewardController.editReward
);

export default router;
