import { Router } from "express";
import StoreController from "../controllers/storeController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const router = new Router();

const storeController = new StoreController();

// Initialize S3 Client with credentials and region from environment variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "samparkabucket",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

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
router.get("/myStores", authMiddleware, storeController.getMyStore);
router.put("/editStore", authMiddleware, storeController.editStore);
router.put(
  "/changeStoreStatus/:storeId",
  authMiddleware,
  storeController.editStoreStatus
);

//loyalitycard
router.get("/getLoyalityCard", authMiddleware, storeController.getLoyalityCard);
router.put(
  "/loyalityCard",
  authMiddleware,
  storeController.createOrEditLoyalityCard
);

export default router;
