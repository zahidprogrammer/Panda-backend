const mongoose = require("mongoose");

const deliveryManSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Cloudinary URL or local file path
      default: "",
    },
    vehicleNumber: {
      type: String,
    },
    drivingLicence: {
      type: String,
    },

    role: {
      type: String,
      default: "deliveryman",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryMan", deliveryManSchema);
