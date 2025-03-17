import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup API to store user in MongoDB
router.post("/signup", async (req, res) => {
  try {
   // console.log('hi');
    
    const { uid, fullName, email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({ uid, name:fullName,email:email });
    await newUser.save();

    res.status(201).json({ message: "User registered in MongoDB" });
  } catch (error) {
    console.error(error);
    
    res.status(500).json({ error: error.message });
  }
});

export default router;
