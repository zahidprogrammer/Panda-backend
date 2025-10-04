const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getSelectedOrders,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/orders → Place new order
router.post("/", protect, createOrder);

// GET /api/orders → Get current user's orders
router.get("/get", protect, getUserOrders);
router.get("/get/:id", protect, getSelectedOrders);

// PUT /api/orders/status → Update order status (cancel, expire, deliver)
router.put("/status", protect, updateOrderStatus);

module.exports = router;
