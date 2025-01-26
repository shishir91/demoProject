import express from "express";
import Store from "../models/storeModel.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const router = express.Router();

// Dynamic manifest.json route
router.get("/manifest.json", async (req, res) => {
  try {
    const { subdomain } = req.query;

    // Find store by subdomain
    const store = await Store.findOne({ url: subdomain });
    const getObjectParams = {
      Bucket: "samparkabucket",
      Key: store.logo,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command);
    store.logo = url;
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Generate dynamic manifest
    const manifest = {
      name: store.name,
      short_name: store.name,
      start_url: "/loyality",
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
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    };

    // Send manifest
    res.setHeader("Content-Type", "application/manifest+json");
    res.status(200).json(manifest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
