// import express from "express";
// import Store from "../models/storeModel.js";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const express = require("express");
const Store = require("../models/storeModel");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3Config.js");

const router = express.Router();

// Dynamic manifest.json route
router.get("/manifest.json", async (req, res) => {
  try {
    const { subdomain } = req.query;

    // Find store by subdomain
    const store = await Store.findOne({ url: subdomain });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    const getObjectParams = {
      Bucket: "samparka",
      Key: store.logo,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command);
    store.logo = url;

    // Generate dynamic manifest
    const manifest = {
      name: store.name,
      short_name: store.name,
      start_url: `https://${subdomain}.samparka.co/loyality`,
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: store.logo,
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: store.logo,
          sizes: "512x512",
          type: "image/png",
        },
      ],
    };

    // Send manifest
    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(manifest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// export default router;
module.exports = router;
