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
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fooddonation-eta.vercel.app",
    "https://fooddonation-7lce77jch-syam-satyanarayana-pillis-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));

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
