const DeliveryMan = require("../models/DeliveryMan");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

// Register Delivery Man
const registerDeliveryMan = async (req, res) => {
  try {
    const { name, email, phone, password, drivingLicence, vehicleType, image } =
      req.body;

    const exist = await DeliveryMan.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDeliveryMan = await DeliveryMan.create({
      name,
      email,
      phone,
      vehicleType,
      image: null,
      drivingLicence,
      password: hashedPassword,
    });

    res.status(201).json(newDeliveryMan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Delivery Man
const loginDeliveryMan = async (req, res) => {
  try {
    const { email, password } = req.body;

    const deliveryMan = await DeliveryMan.findOne({ email });
    if (!deliveryMan) return res.status(404).json({ message: "Not found" });

    const isMatch = await bcrypt.compare(password, deliveryMan.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: deliveryMan._id, role: "deliveryman" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      _id: deliveryMan._id,
      name: deliveryMan.name,
      email: deliveryMan.email,
      phone: deliveryMan.phone,
      image: deliveryMan.image,
      vehicleType: deliveryMan.vehicleType,
      drivingLicence: deliveryMan.drivingLicence,
      token,
      role: "deliveryman",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Delivery Men (Admin use)
const getAllDeliveryMen = async (req, res) => {
  try {
    const deliveryMen = await DeliveryMan.find();
    res.json(deliveryMen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Availability
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const deliveryMan = await DeliveryMan.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );

    res.json(deliveryMan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const editDeliveryManInfo = async (req, res) => {
  try {
    const { data } = req.body;
    const deliveryMan = await DeliveryMan.findOne({ _id: req.params.id });

    if (!deliveryMan) {
      return res
        .status(404)
        .json({ message: "No delivery Man found for this user." });
    }

    const updateObject = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      vehicleType: data.vehicleType,
      drivingLicence: data.drivingLicence,
      image: data.image,
    };

    const updateDeliveryMan = await DeliveryMan.findOneAndUpdate(
      { _id: req.params.id },
      updateObject,
      { new: true }
    );

    if (!updateDeliveryMan) {
      return res.status(404).json({
        message:
          "Delivery Man not found or you don't have permission to update it.",
      });
    }
    res.json(updateDeliveryMan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const deliveryManId = req.user._id;
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ _id: id, deliveryMan: deliveryManId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not assigned" });
    }
    order.status = status;
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: "Prepared for Delivery",
      deliveryMan: null,
    })
      .populate("restaurant")
      .populate("user")
      .populate("items.menuItem")
      .populate("deliveryAddress")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch available orders" });
  }
};

const getDeliveryManOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryMan: req.params.id })
      .populate("restaurant")
      .populate("user")
      .populate("items.menuItem")
      .populate("deliveryAddress")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deliveryman orders" });
  }
};

// Assign deliveryman to order
const pickOrder = async (req, res) => {
  console.log(req.params);

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.deliveryMan) {
      return res.status(400).json({ message: "Order already assigned" });
    }

    order.deliveryMan = req.user._id;
    order.status = "Out for Delivery";
    await order.save();

    res.json({ message: "Order picked successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to pick order" });
  }
};

module.exports = {
  registerDeliveryMan,
  loginDeliveryMan,
  getAllDeliveryMen,
  updateAvailability,
  editDeliveryManInfo,
  updateOrderStatus,
  getAvailableOrders,
  pickOrder,
  getDeliveryManOrders,
};
