// import categoryModel from "../models/categoryModel.js";
// import storeModel from "../models/storeModel.js";
// import productModel from "../models/productModel.js";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import fs from "fs";

// import path from "path";
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import {
//   PutObjectCommand,
//   GetObjectCommand,
//   S3Client,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import mongoose from "mongoose";

const categoryModel = require("../models/categoryModel");
const storeModel = require("../models/storeModel");
const productModel = require("../models/productModel");
const { fileURLToPath } = require("url");
const { dirname, join } = require("path");
const fs = require("fs");
const path = require("path");
const {
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const mongoose = require("mongoose");
const s3 = require("../config/s3Config.js");

class ProductController {
  async addProduct(req, res) {
    const {
      name,
      price,
      description,
      discountRate,
      category,
      calculatedPrice,
    } = req.body; // Include category as user input
    const { storeId } = req.params; // Get storeId from the route
    const imageName = Date.now().toString() + "-" + req.file.originalname;
    console.log("Req.files Adding Product image:", req.file.originalname);
    console.log("Image File", imageName);
    try {
      // Input validation
      if (
        !name ||
        !price ||
        !description ||
        !category ||
        !storeId ||
        !imageName ||
        !calculatedPrice
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
      if (discountRate > 100 || discountRate < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Discount Rate",
        });
      }

      // Check if the store and category exist and match
      const storeCategories = await categoryModel.findOne({ store: storeId });

      if (!storeCategories) {
        return res.status(404).json({
          success: false,
          message: "Store or categories not found",
        });
      }

      // Validate if the category exists in the store's categories
      if (!storeCategories.name.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Invalid category. Available categories: ${storeCategories.name.join(
            ", "
          )}`,
        });
      }

      const putObjectParams = {
        Bucket: "samparka",
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const putCommand = new PutObjectCommand(putObjectParams);
      await s3.send(putCommand);
      console.log(imageName);

      // Prepare product data
      const productData = {
        name,
        price,
        description,
        discountRate: discountRate || 0, // Default to 0 if not provided
        images: imageName,
        category, // Reference the Category document
        storeId,
        calculatedPrice,
      };

      // Create the product in the database
      const product = await productModel.create(productData);

      // Respond with success
      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to add product",
        error: error.message || error,
      });
    }
  }

  async addCategory(req, res) {
    const { categoryName } = req.body; // categoryName is the new name to add
    const { storeId } = req.params; // storeId identifies the store

    try {
      // Find if a category document exists for the given store
      let category = await categoryModel.findOne({ store: storeId });

      if (category) {
        // Check if the categoryName already exists in the name array
        if (!category.name.includes(categoryName)) {
          // Add the new categoryName to the array
          category.name.push(categoryName);
          await category.save();
        }
        return res.status(200).json({
          success: true,
          message: "Category updated successfully",
          category,
        });
      } else {
        // Create a new category document
        category = await categoryModel.create({
          name: [categoryName], // Initialize with the new categoryName
          store: storeId,
        });
        return res.status(201).json({
          success: true,
          message: "Category created successfully",
          category,
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to add category",
        error: error.message,
      });
    }
  }
  async getProduct(req, res) {
    const { storeUrl } = req.params;
    console.log("Sending products");
    try {
      const checkStore = await storeModel.findOne({ url: storeUrl });
      if (checkStore) {
        console.log("Store Exists");

        // Use the storeId to fetch the products
        const storeId = checkStore._id; // Assuming '_id' is the store identifier
        try {
          const products = await productModel.find({ storeId });

          // Map through the products and generate signed URLs for images
          for (const product of products) {
            const imageUrls = await Promise.all(
              product.images.map(async (image) => {
                const getObjectParams = {
                  Bucket: "samparka",
                  Key: image, // Assuming image is the name of the file in S3
                };
                const command = new GetObjectCommand(getObjectParams);
                return await getSignedUrl(s3, command, {
                  expiresIn: 3600 * 60,
                });
              })
            );

            // Replace the images array with the generated URLs
            product.images = imageUrls;
          }

          if (!products || products.length === 0) {
            return res.json({ success: false, message: "No products found" });
          }
          return res.json({ success: true, products });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Server Error" });
        }
      } else {
        return res.status(404).json({ message: "Store not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  async getSingleProduct(req, res) {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format" });
    }

    try {
      // Fetch the single product based on the productId
      const product = await productModel.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Map through the images array and generate a signed URL for each image
      const imageUrls = await Promise.all(
        product.images.map(async (image) => {
          const getObjectParams = {
            Bucket: "samparka",
            Key: image, // Assuming image is the name of the file in S3
          };
          const command = new GetObjectCommand(getObjectParams);
          return await getSignedUrl(s3, command, { expiresIn: 3600 });
        })
      );

      // Replace the images array with the generated URLs
      product.images = imageUrls;

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  async getCategory(req, res) {
    const { storeId } = req.params;
    try {
      const category = await categoryModel.find({ store: storeId });
      if (!category) {
        return res
          .status(404)
          .json({ message: "No Categories in the store yet" });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  async editProduct(req, res) {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountRate,
      category,
      removedImages,
      calculatedPrice,
    } = req.body;
    const __filename = __filename;
    const __dirname = dirname(__filename);
    console.log(removedImages);
    const removedImagesArray = JSON.parse(removedImages);
    console.log("Req body ", req.body);

    if (discountRate > 100 || discountRate < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid Discount Rate",
      });
    }

    function getImageNameFromS3Url(url) {
      const s3Url = new URL(url);
      return s3Url.pathname.substring(1);
    }

    const imageNames = removedImagesArray.map((url) =>
      getImageNameFromS3Url(url)
    );

    // Decode the URL-encoded image names
    const decodedImageNames = imageNames.map((name) =>
      decodeURIComponent(name)
    );
    console.log("Decoded Image Names: ", decodedImageNames);

    try {
      let product = await productModel.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      let updatedImages = product.images || [];
      console.log("Req File, ", req.file);
      console.log("Req Files, ", req.files);

      // Check if new images are uploaded
      if (req.files && req.files.length > 0) {
        console.log("New images received:", req.files.length);

        // Upload new images to S3 and append to the existing array
        for (const file of req.files) {
          const imageName = Date.now().toString() + "-" + file.originalname;
          const putObjectParams = {
            Bucket: "samparka",
            Key: imageName,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const putCommand = new PutObjectCommand(putObjectParams);
          await s3.send(putCommand);
          updatedImages.push(imageName); // Append to the images array
        }
      }

      // Delete images from S3
      for (const img of decodedImageNames) {
        const deleteParams = {
          Bucket: "samparka",
          Key: img, // Ensure `img` is the S3 key, not URL
        };
        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3.send(deleteCommand);

        // Remove the image reference from MongoDB
        updatedImages = updatedImages.filter((image) => image !== img);
      }

      // Update the product with new data
      const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        {
          name,
          price,
          description,
          discountRate: discountRate || 0,
          images: updatedImages,
          category,
          calculatedPrice,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update product",
        error: error.message || error,
      });
    }
  }
}

module.exports = new ProductController();
