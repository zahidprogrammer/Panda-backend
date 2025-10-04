const express = require("express");
const router = express.Router();
const {
  saveDeliveryAddress,
  getMyAddress,
} = require("../controllers/deliveryAddressController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/address → Save or update address
router.post("/send", protect, saveDeliveryAddress);

// GET /api/address → Get address
router.get("/get", protect, getMyAddress);

module.exports = router;
