//routes/auth.js
const express = require("express");
const mongoose = require('mongoose');
const User = require("../models/User");
const { auth, db } = require("../FireBase/firebaseAdmin");
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Signup API to store user in MongoDB
router.post("/signup", async (req, res) => {
  try {
    const { uid, fullName, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ uid, name: fullName, email: email });
    await newUser.save();

    res.status(201).json({ message: "User registered in MongoDB" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Check user endpoint
router.post('/check-user', async (req, res) => {
  const { uid } = req.body;

  try {
    const user = await User.findOne({ uid });
    if (user) {
      return res.status(200).json({ 
        _id: user._id,
        role: user.role,
        email: user.email,
        countriesChosen: user.countriesChosen,
        courses: user.courses,
        universities: user.universities,
        education: user.education  // include education
      });
    }
    res.status(404).json({ error: 'User not found in MongoDB' });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Promote a user to admin
router.put("/make-admin", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User promoted to admin", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demote an admin back to user
router.put("/remove-admin", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate({ email }, { role: "user" }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User demoted to user", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user by UID (Firebase Auth, Firestore, MongoDB)
router.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Safe-check Firebase Auth
    try { await auth.getUser(uid); } catch (err) {
      if (err.code !== 'auth/user-not-found') throw err;
    }
    try { await auth.deleteUser(uid); } catch (err) {
      if (err.code !== 'auth/user-not-found') throw err;
    }

    // Delete Firestore doc
    await db.collection("users").doc(uid).delete();

    // Delete MongoDB doc
    const deletedUser = await User.findOneAndDelete({ uid });
    if (!deletedUser) return res.status(404).json({ message: "User not found in MongoDB" });

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete user by email (MongoDB only)
router.delete("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Apply course, country, universities
router.put('/apply-course/:userId', async (req, res) => {
  const { userId } = req.params;
  const { country, course, universities } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { countriesChosen: [country] },
        $push: { courses: course, universities: { $each: universities } }
      },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found in MongoDB" });
    res.status(200).json({ message: "Course applied successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove course
router.put('/remove-course/:userId', async (req, res) => {
  const { userId } = req.params;
  const { course } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { courses: course } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found in MongoDB" });
    res.status(200).json({ message: "Course removed successfully", user: updatedUser });
  } catch (error) {
    console.error("Error removing course:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove country
router.put('/remove-country/:userId', async (req, res) => {
  const { userId } = req.params;
  const { country } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { countriesChosen: country } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found in MongoDB" });
    res.status(200).json({ message: "Country removed successfully", user: updatedUser });
  } catch (error) {
    console.error("Error removing country:", error);
    res.status(500).json({ error: error.message });
  }
});

// Remove university
router.put('/remove-university/:userId', async (req, res) => {
  const { userId } = req.params;
  const { university } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { universities: university } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found in MongoDB" });
    res.status(200).json({ message: "University removed successfully", user: updatedUser });
  } catch (error) {
    console.error("Error removing university:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by MongoDB _id (include education)
router.post('/get-user-by-id', async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        countriesChosen: user.countriesChosen,
        courses: user.courses,
        universities: user.universities,
        image: user.image,
        education: user.education // now returned
      });
    }
    res.status(404).json({ error: 'User not found in MongoDB' });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Dynamic field update
router.put('/update-:field/:userId', async (req, res) => {
  const { field, userId } = req.params;
  const updateValue = req.body[field];
  try {
    const updateObject = { [field]: updateValue };
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateObject }, { new: true });
    if (updatedUser) {
      return res.status(200).json({ message: `${field} updated successfully`, user: updatedUser });
    }
    res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.put('/upload-image/:userId', upload.single('image'), async (req, res) => {
  const { userId } = req.params;
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  try {
    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(userId, { image: imagePath }, { new: true });
    res.status(200).json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update user education (dedicated endpoint)
router.put("/update-education/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { education } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { education },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Education updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating education:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
