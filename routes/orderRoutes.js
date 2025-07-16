// backend/routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Menu = require("../models/MenuItem");
// POST /order - receive order from table
router.post("/", async (req, res) => {
  try {
    const { table, items, note } = req.body;

    if (!table || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing table or items" });
    } const menuItems = await Menu.find({ name: { $in: items.map(i => i.name) } });

    // ✅ Calculate total using quantity
    const total = items.reduce((sum, item) => {
      const matched = menuItems.find(m => m.name === item.name);
      return sum + (matched?.price || 0) * item.quantity;
    }, 0);

    // ✅ Save full items (with quantity) and total
    const order = new Order({ table, items, note, total });
    await order.save();

    console.log("📦 New order received:", req.body);
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("❌ Order failed:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});


// GET /orders - for admin
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ time: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// DELETE /orders/:id - delete a specific order
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

module.exports = router;


