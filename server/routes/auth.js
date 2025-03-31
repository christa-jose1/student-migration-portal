const express = require("express");
const User = require("../models/User");
const { auth, db } = require("../FireBase/firebaseAdmin");

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
      res.status(200).json({ 
        _id: user._id,
        role:user.role,
        email:user.email,
      });
    } else {
      res.status(404).json({ error: 'User not found in MongoDB' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Promote a user to admin in MongoDB
router.put("/make-admin", async (req, res) => {
  const { email } = req.body;
  console.log(email,"email>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  
  try {
    const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User promoted to admin", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demote an admin back to a regular user
router.put("/remove-admin", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: "user" }, // Change role to "user"
      { new: true }
    );

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User demoted to user", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.delete("/users/:uid", async (req, res) => {
//   try {
//     const { uid } = req.params;

//     // 1️⃣ Delete from Firebase Authentication
//     await auth.deleteUser(uid);

//     // 2️⃣ Delete from Firestore
//     await db.collection("users").doc(uid).delete();

//     // 3️⃣ Delete from MongoDB
//     const deletedUser = await User.findOneAndDelete({ uid });

//     if (!deletedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "User deleted successfully", deletedUser });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });


router.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Check if the user exists in Firebase Authentication
    try {
      await auth.getUser(uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.warn(`No user found in Firebase Auth for UID: ${uid}`);
      } else {
        throw error; // If another error occurs, throw it
      }
    }

    // Delete from Firebase Authentication (only if user exists)
    try {
      await auth.deleteUser(uid);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.warn(`User already deleted from Firebase Auth: ${uid}`);
      } else {
        throw error;
      }
    }

    // Delete from Firestore
    await db.collection("users").doc(uid).delete();

    // Delete from MongoDB
    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found in MongoDB" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.delete("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params; // Extract email from URL params

    // Find and delete the user by email
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





module.exports = router;
