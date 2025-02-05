// import { Router } from "express";
// import authMiddleware from "../middlewares/authMiddleware.js";
// import RewardController from "../controllers/rewardController.js";
// import multer from "multer";
const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const rewardController = require("../controllers/rewardController");
const multer = require("multer");

const router = new Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const rewardController = new RewardController();

router.post("/createReward", authMiddleware, rewardController.createReward);
router.get("/getRewards/:storeId", rewardController.getRewards);
router.delete(
  "/deleteReward/:rewardID",
  authMiddleware,
  rewardController.deleteReward
);
router.put(
  "/editReward/:storeId",
  upload.single("image"),
  authMiddleware,
  (req, res) => {
    rewardController.editReward(req, res);
  }
);

// export default router;
module.exports = router;
