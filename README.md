# 🍽️ QR Code Restaurant Ordering System

Welcome to the **QR Code Restaurant Ordering System**, a complete web application designed to streamline restaurant ordering using QR codes. This project allows customers to scan a QR code at their table to view the menu, place orders, and provide feedback—all without any physical interaction with staff.

---

## 🚀 Features

### ✅ **Customer Interface**

* Scan QR codes to open the menu linked to a specific table.
* Browse categorized menu items with images.
* Adjust quantity, add special notes, and place orders.
* View an order success message and submit feedback with a star rating.

### ✅ **Admin Panel**

* **Live Orders Dashboard:** View, refresh, and manage live orders.
* **Revenue & Order Tracking:** Real-time statistics on total orders and revenue.
* **Menu Management:** View, add, and delete menu items including images.
* **Customer Ratings:** View and delete customer ratings and feedback.

### ✅ **QR Code Generator**

* Auto-generates stylish QR codes for each table.
* QR codes include restaurant branding/logo and table numbers.

---

## 🛠️ Tech Stack

| Frontend      | Backend             | Database | Tools                             |
| ------------- | ------------------- | -------- | --------------------------------- |
| HTML, CSS, JS | Node.js, Express.js | MongoDB  | QR Code Generator, Canvas, Multer |

---

## 📥 Installation Guide

1. **Clone Repository:**

```bash
git clone https://github.com/your-repo/qr-restaurant-app.git
cd qr-restaurant-app
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Set Up MongoDB:**

* Ensure MongoDB is running on `mongodb://127.0.0.1:27017/qrmenu`

4. **Generate QR Codes:**

```bash
node backend/generateQRCodes.js
```

QR codes will be saved in the `/qrcodes` directory.

5. **Run the Server:**

```bash
node backend/server.js
```

6. **Access Frontend:**

* Customer Menu: `http://localhost:3000/?table=1`
* Admin Panel: `http://localhost:3000/admin.html`

---

## ⭐ Feedback & Rating

* Customers can submit feedback after placing orders.
* Admin can view all ratings in the admin panel.

---

## 🎨 Customization

* Update your restaurant logo in `/assets/logo.png` to embed it inside the QR codes.
* Modify `backend/generateQRCodes.js` to adjust QR styling.
* Change API\_BASE URL in frontend JS files to match deployment settings.

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome! Open an issue first to discuss proposed changes.


