const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
   resetToken: String,
resetTokenExpiry: Date,

    role: {
      type: String,
      enum: ["donor", "ngo"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
  type: String,
},
resetTokenExpiry: {
  type: Date,
},
location: {
  type: String, // e.g. "Vadodara, Gujarat"
},

  },
  { timestamps: true }
  
);

module.exports = mongoose.model("User", userSchema);
