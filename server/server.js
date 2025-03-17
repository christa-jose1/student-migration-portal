import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);


// ========== POSTS ==========

// Create Post
app.post("/posts", async (req, res) => {
  const { userId, title, content } = req.body;
  try {
    const newPost = new Post({ userId, title, content, likes: [], bookmarks: [] });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name email");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== COMMENTS ==========

// Add Comment
app.post("/comments", async (req, res) => {
  const { userId, postId, content } = req.body;
  try {
    const newComment = new Comment({ userId, postId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Comments by Post
app.get("/comments/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "name");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected...");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
