const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  createDonation,
  getPendingDonations,
  acceptDonation,
  markDelivered,
  getMyDonations,
  getNgoHistory, // 👈 THIS MUST BE HERE
} = require("../controllers/donationController");

const { protect, donorOnly, ngoOnly } = require("../middleware/authMiddleware");

// DONOR creates donation
router.post("/", protect, donorOnly,upload.single("foodImage"), createDonation);

// DONOR views own donations  ✅ REQUIRED
router.get("/mine", protect, donorOnly, getMyDonations);

// NGO views pending
router.get("/pending", protect, ngoOnly, getPendingDonations);

// NGO accepts
router.put("/accept/:id", protect, ngoOnly, acceptDonation);

// NGO delivers
router.put("/deliver/:id", protect, ngoOnly, markDelivered);
router.get("/ngo/history", protect, ngoOnly, getNgoHistory);

module.exports = router;
