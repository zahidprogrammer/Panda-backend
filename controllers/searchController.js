const Restaurant = require("../models/Restaurant.js");
const MenuItem = require("../models/MenuItem.js");
const User = require("../models/User");

exports.searchAll = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).json({ message: "Search query required" });
    }

    // Case-insensitive regex search
    const regex = new RegExp(searchTerm, "i");

    // Search both restaurants and menu items
    const [restaurants, menuItems] = await Promise.all([
      Restaurant.find({ name: regex }).limit(10),
      MenuItem.find({
        $or: [{ name: regex }, { category: regex }],
      })
        .populate({
          path: "restaurant", // first populate restaurant
          select: "name location user", // choose what you need
          populate: {
            path: "user", // then populate restaurant → user
            select: "_id name email", // fetch user fields
          },
        })
        .limit(10),
    ]);

    res.json({
      searchTerm,
      restaurants,
      menuItems,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Save search history when user clicks a search result
exports.addSearchHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const { restaurant, menuItem } = req.body;

    if (!restaurant && !menuItem) {
      return res
        .status(400)
        .json({ message: "Restaurant or MenuItem is required" });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const search = {
      restaurant: restaurant || null,
      menuItem: menuItem || null,
      createdAt: new Date(),
    };

    // ✅ Check if already exists
    const check = user.search.find(
      (x) =>
        (restaurant && x.restaurant?.toString() === restaurant) ||
        (menuItem && x.menuItem?.toString() === menuItem)
    );

    if (check) {
      // ✅ Update timestamp if already exists
      await User.updateOne(
        {
          _id: id,
          "search._id": check._id,
        },
        {
          $set: {
            "search.$.createdAt": new Date(),
          },
        }
      );
    } else {
      user.search.push(search);
      await user.save();
    }

    res.json({ message: "Search history saved", search: user.search });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const { id } = req.user; // ✅ user from auth middleware

    const user = await User.findById(id)
      .populate({
        path: "search.restaurant",
        select: "name images location",
        populate: {
          path: "user", // populate restaurant from menuItem
          select: "_id",
        },
      })
      .populate({
        path: "search.menuItem",
        select: "name image price restaurant", // include restaurant reference
        populate: {
          path: "restaurant", // populate restaurant from menuItem
          select: "name images location",
          populate: {
            path: "user", // populate restaurant from menuItem
            select: "_id",
          },
        },
      })
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    // Sort by createdAt (newest first)
    const history = [...user.search].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Limit to last 10
    const limitedHistory = history.slice(0, 10);

    res.json({ history: limitedHistory });
  } catch (error) {
    console.error("Error in getSearchHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSearchHistory = async (req, res) => {
  try {
    const { id } = req.user;
    const { searchId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find search entry
    const searchEntry = user.search.id(searchId);
    if (!searchEntry) {
      return res
        .status(404)
        .json({ message: "Search history entry not found" });
    }

    // Remove it
    await searchEntry.deleteOne();
    await user.save();

    res.json({
      message: "Search history entry deleted",
      history: user.search,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
