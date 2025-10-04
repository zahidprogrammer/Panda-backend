const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DeliveryMan = require("../models/DeliveryMan");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
const protectForDeliveryMan = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await DeliveryMan.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access denied" });
  }
};

// ✅ NEW: Only allow users with role 'restaurant'
const restaurantOnly = (req, res, next) => {
  if (req.user && req.user.role === "restaurant") {
    next();
  } else {
    res.status(403).json({ message: "Restaurant access denied" });
  }
};
const deliveryManOnly = (req, res, next) => {
  if (req.user && req.user.role === "deliveryman") {
    next();
  } else {
    res.status(403).json({ message: "deliveryman access denied" });
  }
};

module.exports = {
  protect,
  protectForDeliveryMan,
  adminOnly,
  restaurantOnly,
  deliveryManOnly,
};
