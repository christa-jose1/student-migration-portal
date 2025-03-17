const express = require("express");
const Post = require("../models/Post"); // Assuming you have a Post model
const router = express.Router();

// Get paginated forum posts
router.get("/posts", async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
