const express = require("express");
const router = express.Router();
const Menu = require("../models/MenuItem");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Menu item not found." });
    }

    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item and image deleted successfully." });
  } catch (err) {
    console.error("Failed to delete menu item:", err);
    res.status(500).json({ error: "Failed to delete menu item." });
  }
});

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST route
router.post("/", upload.single('image'), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : "";

    if (!name || !price || !category) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newItem = new Menu({ name, price, category, image });
    await newItem.save();

    res.json({ message: "Menu item added with image." });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Server error while adding menu item." });
  }
});

// ✅ GET /menu
router.get("/", async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    console.error("Failed to fetch menu:", err);
    res.status(500).json({ error: "Failed to fetch menu." });
  }
});

// ✅ Export at the end
module.exports = router;
