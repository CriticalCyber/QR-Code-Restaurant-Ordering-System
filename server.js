// backend/server.js (updated)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/qrmenu", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Use routes
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use("/orders", orderRoutes); //  for GET /orders (admin panel)
app.use("/rating", ratingRoutes);
// ✅ Serve uploads folder

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server start
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
