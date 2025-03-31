const Guide = require("../models/Guide");
const path = require("path");
const fs = require("fs");

// Upload Guide
exports.uploadGuide = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { countryCode } = req.body;
    const fileName = req.file.filename;
    const fileUrl = `/uploads/${fileName}`;

    const newGuide = new Guide({ fileName, fileUrl, countryCode });
    await newGuide.save();

    res.status(201).json(newGuide);
  } catch (error) {
    console.error("Error uploading guide:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Guides
exports.getGuides = async (req, res) => {
  try {
    const guides = await Guide.find();
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getGuidesByCountry = async (req, res) => {
  try {
    const { countryCode } = req.params; // Get country code from URL parameter

    if (!countryCode) {
      return res.status(400).json({ message: "Country code is required" });
    }

    const guides = await Guide.find({ countryCode }); // Find guides with the given country code

    if (guides.length === 0) {
      return res.status(404).json({ message: "No guides found for this country code" });
    }

    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Guide
exports.deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await Guide.findById(id);
    if (!guide) return res.status(404).json({ message: "Guide not found" });

    // Delete the file from storage
    const filePath = path.join(__dirname, "../uploads", guide.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await guide.deleteOne();
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
