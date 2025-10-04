const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    deliveryInstructions: { type: String },
  },
  { timestamps: true }
);

const DeliveryAddress = mongoose.model(
  "DeliveryAddress",
  deliveryAddressSchema
);

module.exports = DeliveryAddress;
