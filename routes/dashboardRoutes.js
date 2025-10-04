const express = require("express");
const router = express.Router();
const { protect, restaurantOnly } = require("../middleware/authMiddleware");
const {
  getRestaurantOverview,
  getMyRestaurantOrders,
  getMyMenuItems,
  DeleteOrder,
} = require("../controllers/dashboardController");

// Overview for restaurant owner
router.get("/overview", protect, restaurantOnly, getRestaurantOverview);

// All orders for restaurant owner
router.get("/orders", protect, restaurantOnly, getMyRestaurantOrders);
router.delete("/orders/:id", protect, restaurantOnly, DeleteOrder);

// Optional: menu items for dashboard
router.get("/menuitems", protect, restaurantOnly, getMyMenuItems);

module.exports = router;
