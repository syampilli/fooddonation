const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const donationRoutes = require("./routes/donationRoutes");
const path = require("path");
const distanceRoutes = require("./routes/distanceRoutes");

// connect database
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/donations", donationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/distance", require("./routes/distanceRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("Food Donation Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
