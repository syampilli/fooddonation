const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const distanceRoutes = require("./routes/distanceRoutes");
const testRoutes = require("./routes/testRoutes");
const path = require("path");

const app = express();

// connect DB
connectDB();

// 🔥 SMART CORS (handles ALL vercel preview URLs)
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      // allow localhost
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // allow all vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 handle preflight
app.options("*", cors());

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distance", distanceRoutes);
app.use("/api/test", testRoutes);

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Food Donation Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
