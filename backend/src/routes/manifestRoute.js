import express from "express";
import Store from "../models/storeModel.js";

const router = express.Router();

// Dynamic manifest.json route
router.get("/manifest.json", async (req, res) => {
  try {
    // Extract subdomain from request
    const host = req.headers.host; // e.g., "shishir.samparka.co"
    const subdomain = host.split(".")[0]; // e.g., "shishir"

    // Find store by subdomain
    const store = await Store.findOne({ subdomain });
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Generate dynamic manifest
    const manifest = {
      name: store.name,
      short_name: store.name,
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
