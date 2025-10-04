const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant"); // Use correct capitalization for the model name

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    const ownedRestaurant = await Restaurant.findOne({ user: req.user._id });

    if (!ownedRestaurant) {
      return res
        .status(404)
        .json({ message: "No restaurant found for this user." });
    }

    const newItem = new MenuItem({
      restaurant: ownedRestaurant._id,
      name,
      description,
      price,
      image: null,
      category,
      available,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyMenuItems = async (req, res) => {
  try {
    const ownedRestaurant = await Restaurant.findOne({ user: req.user._id });

    if (!ownedRestaurant) {
      return res
        .status(404)
        .json({ message: "No restaurant found for this user." });
    }

    const items = await MenuItem.find({ restaurant: ownedRestaurant._id }).sort(
      { createdAt: -1 }
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { data } = req.body;
    const ownedRestaurant = await Restaurant.findOne({ user: req.user._id });

    if (!ownedRestaurant) {
      return res
        .status(404)
        .json({ message: "No restaurant found for this user." });
    }

    const updateObject = {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      category: data.category,
      available: data.available,
    };

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurant: ownedRestaurant._id },
      updateObject,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found or you don't have permission to update it.",
      });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const ownedRestaurant = await Restaurant.findOne({ user: req.user._id });

    if (!ownedRestaurant) {
      return res
        .status(404)
        .json({ message: "No restaurant found for this user." });
    }

    const deleted = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurant: ownedRestaurant._id, // Correct: Use the restaurant's ID
    });

    if (!deleted) {
      return res.status(404).json({
        message:
          "Menu item not found or you don't have permission to delete it.",
      });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
