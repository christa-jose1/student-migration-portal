const express = require("express");
const multer = require("multer");
const { uploadGuide, getGuides, deleteGuide,getGuidesByCountry } = require("../controllers/guideController");

const router = express.Router();

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("file"), uploadGuide);
router.get("/", getGuides);
router.delete("/:id", deleteGuide);
router.get("/guides/:countryCode", getGuidesByCountry);

module.exports = router;
