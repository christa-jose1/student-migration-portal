const express = require('express');
const Post = require('../models/Post');


const router = express.Router();

// Create a new post
router.post('/create', async (req, res) => {
  try {
    const { userId, title, category, content } = req.body;
    const newPost = new Post({ userId, title, category, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Fetch all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});
module.exports = router;