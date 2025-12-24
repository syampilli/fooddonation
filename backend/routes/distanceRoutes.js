const express = require("express");
const router = express.Router();
const { protect, ngoOnly } = require("../middleware/authMiddleware");
const { getDistance } = require("../controllers/distanceController");

router.get("/", protect, ngoOnly, getDistance);

module.exports = router;
