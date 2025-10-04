const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { restaurant, subtotal, items, deliveryFee, total, address } =
      req.body;

    const formattedItems = items.map((item) => ({
      menuItem: item._id,
      quantity: item.quantity,
    }));
    const userId = req.user._id;

    const newOrder = await Order.create({
      user: userId,
      restaurant: restaurant,
      items: formattedItems,
      deliveryFee: deliveryFee,
      subtotal: subtotal,
      totalPrice: total,
      deliveryAddress: address,
    });
    newOrder.save();

    res.status(200).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error while placing order" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem")
      .populate("restaurant")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};
const getSelectedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id, _id: req.params.id })
      .populate("items.menuItem")
      .populate("restaurant")
      .populate({
        path: "deliveryAddress",
        model: "DeliveryAddress",
      })
      .sort({
        createdAt: -1,
      });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = newStatus;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating order status" });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  updateOrderStatus,
  getSelectedOrders,
};
