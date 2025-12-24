const jwt = require("jsonwebtoken");
const User = require("../models/User");

// PROTECT ROUTES
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      // 🔥 IMPORTANT CHECK
      if (!user) {
        return res.status(401).json({
          message: "User not found. Please login again.",
        });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token invalid",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};


// DONOR ONLY
const donorOnly = (req, res, next) => {
  if (req.user?.role === "donor") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied: Donor only",
      roleDetected: req.user?.role,
    });
  }
};


// NGO ONLY
const ngoOnly = (req, res, next) => {
  if (req.user && req.user.role === "ngo") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied: NGO only" });
  }
};

module.exports = { protect, donorOnly, ngoOnly };
