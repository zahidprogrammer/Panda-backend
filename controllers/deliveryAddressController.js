const DeliveryAddress = require("../models/DeliveryAddress");

// Save or update delivery address
const saveDeliveryAddress = async (req, res) => {
  try {
    const {
      street,
      apartment,
      city,
      state,
      zipCode,
      mobileNumber,
      deliveryInstructions,
    } = req.body.data;
    const userId = req.user._id;

    let address = await DeliveryAddress.findOne({ user: userId });

    if (address) {
      address.street = street;
      address.apartment = apartment;
      address.city = city;
      address.state = state;
      address.zipCode = zipCode;
      address.mobileNumber = mobileNumber;
      address.deliveryInstructions = deliveryInstructions;
      await address.save();
    } else {
      address = await DeliveryAddress.create({
        user: userId,
        street,
        apartment,
        city,
        state,
        zipCode,
        mobileNumber,
        deliveryInstructions,
      });
    }

    res.status(200).json({ message: "Address saved successfully", address });
  } catch (error) {
    console.error("Save Address Error:", error);
    res.status(500).json({ message: "Server error while saving address" });
  }
};

// Get delivery address
const getMyAddress = async (req, res) => {
  try {
    const address = await DeliveryAddress.findOne({ user: req.user._id });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address);
  } catch (error) {
    console.error("Get Address Error:", error);
    res.status(500).json({ message: "Server error while fetching address" });
  }
};

module.exports = {
  saveDeliveryAddress,
  getMyAddress,
};
