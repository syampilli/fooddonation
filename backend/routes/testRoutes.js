const express = require("express");
const router = express.Router();

const { protect, donorOnly, ngoOnly } = require("../middleware/authMiddleware");

// any logged in user
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Protected route access success ✅",
    user: req.user,
  });
});

// donor only
router.get("/donor", protect, donorOnly, (req, res) => {
  res.json({ message: "Donor dashboard access ✅" });
});

// ngo only
router.get("/ngo", protect, ngoOnly, (req, res) => {
  res.json({ message: "NGO dashboard access ✅" });
});

module.exports = router;
