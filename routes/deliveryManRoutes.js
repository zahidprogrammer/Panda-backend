const express = require("express");
const router = express.Router();
const {
  registerDeliveryMan,
  loginDeliveryMan,
  getAllDeliveryMen,
  updateAvailability,
  editDeliveryManInfo,
  updateOrderStatus,
  pickOrder,
  getAvailableOrders,
  getDeliveryManOrders,
} = require("../controllers/deliveryManController.js");
const {
  protectForDeliveryMan,
  deliveryManOnly,
} = require("../middleware/authMiddleware.js");

router.post("/register", registerDeliveryMan);
router.post("/login", loginDeliveryMan);
router.put("/edit/:id", editDeliveryManInfo);
router.get("/", getAllDeliveryMen);
router.patch("/:id/availability", updateAvailability);
router.get(
  "/orders/deliveryman/:id",
  protectForDeliveryMan,
  deliveryManOnly,
  getDeliveryManOrders
);

router.put(
  "/orders/status/:id",
  protectForDeliveryMan,
  deliveryManOnly,
  updateOrderStatus
);
router.post(
  "/orders/pick/:id",
  protectForDeliveryMan,
  deliveryManOnly,
  pickOrder
);
router.get(
  "/orders/available",
  protectForDeliveryMan,
  deliveryManOnly,
  getAvailableOrders
);

module.exports = router;
