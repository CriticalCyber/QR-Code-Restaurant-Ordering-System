const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  table: String,
  items: [
    {
      name: String,
      quantity: Number
    }
  ],
  note: String,
  total: Number,
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
