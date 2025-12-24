const Donation = require("../models/Donation");

// DONOR: create donation
const createDonation = async (req, res) => {
  try {
    const { foodName, quantity, pickupLocation, expiryTime, phone } = req.body;

    if (!foodName || !quantity || !pickupLocation || !expiryTime || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const donation = await Donation.create({
      donor: req.user._id,
      foodName,
      quantity,
      pickupLocation,
      expiryTime,
      phone,
      foodImage: req.file
        ? `/uploads/${req.file.filename}`
        : null,
    });

    res.status(201).json({ message: "Donation created", donation });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// NGO: view all pending donations
const getPendingDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Pending" })
      .populate("donor", "name email");

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// NGO: accept donation
const acceptDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // 🔒 LOCK CHECK
    if (donation.acceptedBy) {
      return res.status(400).json({
        message: "Donation already accepted by another NGO",
      });
    }

    donation.status = "Accepted";
    donation.acceptedBy = req.user._id;
    await donation.save();

    res.json({ message: "Donation accepted ✅", donation });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// NGO: mark delivered
const markDelivered = async (req, res) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return res.status(404).json({ message: "Donation not found" });
  }

  // 🔐 OWNER CHECK
  if (donation.acceptedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not authorized to deliver this donation",
    });
  }

  donation.status = "Delivered";
  await donation.save();

  res.json({ message: "Donation delivered 🚚", donation });
};

// DONOR: get my donations
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// NGO: get my accepted & delivered donations (HISTORY)
const getNgoHistory = async (req, res) => {
  try {
    const donations = await Donation.find({
      acceptedBy: req.user._id,
      status: { $in: ["Accepted", "Delivered"] },
    })
      .populate("donor", "name email phone")
      .sort({ updatedAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createDonation,
  getPendingDonations,
  acceptDonation,
  markDelivered,
  getMyDonations,
  getNgoHistory, // 🔥 ADD THIS
};
