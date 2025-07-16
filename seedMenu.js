const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

mongoose.connect("mongodb://127.0.0.1:27017/qrmenu", {
  
  useUnifiedTopology: true
});

const menuItems = [
  { name: "Paneer Butter Masala", price: 250, category: "full" },
  { name: "Butter Naan", price: 40, category: "full" },
  { name: "Masala Dosa", price: 100, category: "half" },
  { name: "Veg Biryani", price: 180, category: "full" },
  { name: "Cold Coffee", price: 90, category: "half" },
];

MenuItem.deleteMany({}) // clean existing first
  .then(() => MenuItem.insertMany(menuItems))
  .then(() => {
    console.log("✅ Menu items inserted with category");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Failed to seed:", err);
    mongoose.connection.close();
  });
