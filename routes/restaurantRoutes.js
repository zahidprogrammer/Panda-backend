const express = require("express");
const router = express.Router();
const {
  registerRestaurant,
  getMyRestaurant,
  getAllRestaurant,
  seletcedRestaurant,
} = require("../controllers/restaurantController");

const { protect, restaurantOnly } = require("../middleware/authMiddleware");

// Register new restaurant (only for restaurant role)
router.post("/registerrestaurant", protect, registerRestaurant);

// Get logged-in user's restaurant
router.get("/my/:userid", protect, restaurantOnly, getMyRestaurant);
router.get("/allrestaurant/", getAllRestaurant);
router.get("/selectedrestaurant/:id", seletcedRestaurant);
module.exports = router;
