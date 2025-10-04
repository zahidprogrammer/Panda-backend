const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");

// Register a restaurant
const registerRestaurant = async (req, res) => {
  const { name, location, contactNumber, email, images } = req.body;

  try {
    const userId = req.user._id;

    // Check if user already registered a restaurant
    const existing = await Restaurant.findOne({ user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already registered a restaurant." });
    }

    const userMigrate = await User.findByIdAndUpdate(userId, {
      role: "restaurant",
    });

    const imageUrls = images.map((img) => img.url);

    const restaurant = new Restaurant({
      user: userId,
      name,
      location,
      contactNumber,
      email,
      images: imageUrls,
    });

    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    console.error("Restaurant register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get restaurant info by owner
const getMyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.user._id,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Correctly find menu items using the found restaurant's ID
    const restaurantMenuItem = await MenuItem.find({
      restaurant: restaurant._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ ...restaurant.toObject(), restaurantMenuItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.find({});
    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const seletcedRestaurant = async (req, res) => {
  try {
    const userId = req.params.id;

    const restaurant = await Restaurant.findOne({ user: userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Correctly find menu items using the found restaurant's ID
    const menuItems = await MenuItem.find({ restaurant: restaurant._id });

    res.status(200).json({
      ...restaurant.toObject(),
      restaurantMenuItem: menuItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerRestaurant,
  getMyRestaurant,
  getAllRestaurant,
  seletcedRestaurant,
};
