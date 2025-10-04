const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const fileUpload = require("express-fileupload");
const deliveryAddressRoutes = require("./routes/deliveryAddressRoutes.js");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const deliveryManRoutes = require("./routes/deliveryManRoutes.js");
const searchRoutes = require("./routes/searchRoutes.js");

// Load env variables
dotenv.config();

// Connect MongoDB
connectDB();

// Init express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("🍱 PandaFood API is running...");
});

// User Auth Routes
app.use("/api/users", require("./routes/userRoutes"));

// image upload
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

// Restaurant Setup Routes
app.use("/api/menu-items", require("./routes/menuRoutes"));
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", require("./routes/menuRoutes"));
// controling restaurant dashBoard
app.use("/api/restaurantowner/dashboard", dashboardRoutes);
// user's address for delivery
app.use("/api/address", deliveryAddressRoutes);

// deliveryman route
app.use("/api/deliveryman", deliveryManRoutes);
// handling order
app.use("/api/orders", orderRoutes);
// search option
app.use("/api/search", searchRoutes);
// 404 Route Handling
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("💥 Error:", err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
