const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  feedback: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Rating", ratingSchema);
