// import { Router } from "express";
// import ProductController from "../controllers/productController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";
// import customerMiddleware from "../middlewares/customerMiddleware.js";

// import multer from "multer";

const { Router } = require("express");
const multer = require("multer");
const productController = require("../controllers/productController");
const customerMiddleware = require("../middlewares/customerMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

// const productController = new ProductController();

router.post(
  "/addProduct/:storeId",
  customerMiddleware,
  upload.single("image"),
  productController.addProduct
);
router.post(
  "/addCategory/:storeId",
  customerMiddleware,
  productController.addCategory
);
router.get(
  "/getCategory/:storeId",
  customerMiddleware,
  productController.getCategory
);
router.get("/getProducts/:storeId", productController.getProduct);
router.get("/getProduct/:productId",productController.getSingleProduct);
router.put(
  "/update/:id",
  customerMiddleware,
  upload.array("images"),
  productController.editProduct
);

// export default router;
module.exports = router;
