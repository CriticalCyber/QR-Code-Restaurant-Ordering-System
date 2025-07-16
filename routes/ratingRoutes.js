const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");

// ✅ POST /rating - Save a new rating
router.post("/", async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required." });
    }

    const newRating = new Rating({ rating, feedback, createdAt: new Date() });
    await newRating.save();

    res.json({ message: "Rating saved successfully." });
  } catch (err) {
    console.error("Error saving rating:", err);
    res.status(500).json({ error: "Failed to save rating." });
  }
});

// ✅ GET /rating - Get all ratings for admin
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    console.error("Error fetching ratings:", err);
    res.status(500).json({ error: "Failed to fetch ratings." });
  }
});

// ✅ DELETE /rating/:id - Delete a rating
router.delete("/:id", async (req, res) => {
  try {
    const rating = await Rating.findByIdAndDelete(req.params.id);
    if (!rating) {
      return res.status(404).json({ error: "Rating not found." });
    }
    res.json({ message: "Rating deleted successfully." });
  } catch (err) {
    console.error("Failed to delete rating:", err);
    res.status(500).json({ error: "Failed to delete rating." });
  }
});

module.exports = router;
