//routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const Post = require("../models/Post");

// Routes
router.post("/create", postController.createPost);
router.get("/", postController.getPosts);
router.put("/:id/like", postController.likePost);
router.put("/:id/comment", postController.commentPost);
router.delete("/delete-all", postController.deleteAllPosts);
router.delete("/:id", postController.deletePost);


router.put("/:postId/comment/:commentId/report", async (req, res) => {
    try {
      const { postId, commentId } = req.params;
  
      // Find post
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // Find comment inside post
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });
  
      // Mark comment as reported
      comment.reported = true;
      await post.save();
  
      res.status(200).json({ message: "Comment reported successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error reporting comment", error });
    }
  });
  

  router.get("/comments/reported", postController.getReportedComments);
  router.delete("/comments/:commentId", postController.deleteReportedComment);

module.exports = router;
