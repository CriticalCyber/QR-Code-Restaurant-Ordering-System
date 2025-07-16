const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/qrmenu", { useNewUrlParser: true, useUnifiedTopology: true });

const Menu = require("./MenuItem");

Menu.find().then(data => {
  console.log("Menu items:", data);
  mongoose.disconnect();
}).catch(err => {
  console.error("Error fetching menus:", err);
  mongoose.disconnect();
});
