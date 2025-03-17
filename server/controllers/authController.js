import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendEmail } from "../utils/mailer.js";

dotenv.config();

// User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user with default role 'user' if not provided
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is "user"
    });
    await newUser.save();

    // Send welcome email
    await sendEmail(
      email,
      "Welcome to Our App 🎉",
      "Hello, thanks for signing up!",
      `<h2>Welcome, ${name}!</h2><p>Thanks for joining us.</p>`
    );

    res.status(201).json({ message: "User registered successfully & email sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT Secret not set in environment variables" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
