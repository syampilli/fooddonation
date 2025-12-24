const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Delivered"],
      default: "Pending",
    },
    acceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    phone: {
  type: String,
  required: true,
},

foodImage: {
  type: String, // Cloudinary image URL
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);
