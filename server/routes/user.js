// routes/users.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("_id name"); // Only return _id and username
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

module.exports = router;