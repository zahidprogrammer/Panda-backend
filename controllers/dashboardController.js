const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

// Get owner restaurant overview (analytics)
exports.getRestaurantOverview = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const totalOrders = await Order.countDocuments({
      restaurant: restaurant._id,
    });
    const pendingOrders = await Order.countDocuments({
      restaurant: restaurant._id,
      status: "Pending",
    });
    const deliveredOrders = await Order.countDocuments({
      restaurant: restaurant._id,
      status: "Delivered",
    });

    const totalSalesAgg = await Order.aggregate([
      { $match: { restaurant: restaurant._id, status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
    ]);

    const totalSales = totalSalesAgg[0] ? totalSalesAgg[0].totalSales : 0;

    res.json({
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalSales,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders for owner
exports.getMyRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("user", "name email")
      .populate({
        path: "deliveryAddress",
        model: "DeliveryAddress",
      })
      .populate({
        path: "restaurant",
        model: "Restaurant",
      })
      .populate({
        path: "items.menuItem",
        model: "MenuItem",
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all menu items for owner (optional, already exists in menuController)
exports.getMyMenuItems = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const items = await MenuItem.find({ restaurant: restaurant._id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.DeleteOrder = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const items = await Order.findOneAndDelete({
      _id: req.params.id,
      restaurant: restaurant._id,
    });
    res.json({ items, messagae: "Order Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
