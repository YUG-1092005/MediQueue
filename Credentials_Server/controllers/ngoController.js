const Ngo = require("../models/ngoModel");

// Get all NGOs
const getAllNgos = async (req, res) => {
  try {
    const ngos = await Ngo.find();

    res.json({
      success: true,
      ngos,
    });
  } catch (error) {
    console.error("Error fetching ngos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch ngos",
    });
  }
};

module.exports = { getAllNgos };
