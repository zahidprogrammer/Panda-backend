const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMyMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController.js");
const { protect, restaurantOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, restaurantOnly, createMenuItem)
  .get(protect, restaurantOnly, getMyMenuItems);

router.route("/menuoption/:id").put(protect, restaurantOnly, updateMenuItem);
router.route("/menudelete/:id").delete(protect, restaurantOnly, deleteMenuItem);

module.exports = router;
