const Post = require("../models/Post");
const User = require("../models/User");

// ✅ Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, category, content, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({ title, category, content, user: userId });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// ✅ Get all posts with user details
exports.getPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate("user", "name email") // Ensure "name" is included
        .populate("comments.user", "name email") // Ensure "name" for comments is included
        .sort({ createdAt: -1 });
  
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching posts", error });
    }
  };
  

// ✅ Like a post
exports.likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id)
    .populate("user", "name email") // Ensure "name" is included
    .populate("comments.user", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

// ✅ Add a comment to a post
exports.commentPost = async (req, res) => {
  try {
    const { userId, text } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const post = await Post.findById(req.params.id)
    .populate("user", "name email") // Ensure "name" is included
    .populate("comments.user", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// ✅ Delete a post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};


exports.deleteAllPosts = async (req, res) => {
  try {
    await Post.deleteMany({}); // Deletes all posts
    res.json({ message: "All posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all posts", error });
  }
};

exports.getReportedComments = async (req, res) => {
    try {
      const posts = await Post.find({ "comments.reported": true })
        .populate("comments.user", "name email")
        .select("title comments");
  
      const reportedComments = posts.flatMap((post) =>
        post.comments
          .filter((comment) => comment.reported)
          .map((comment) => ({
            postId: post._id,
            postTitle: post.title,
            commentId: comment._id,
            user: comment.user,
            text: comment.text,
            createdAt: comment.createdAt,
          }))
      );
  
      res.json(reportedComments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reported comments", error });
    }
  };


  exports.deleteReportedComment = async (req, res) => {
    try {
      const { commentId } = req.params;
  
      const post = await Post.findOne({ "comments._id": commentId });
  
      if (!post) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      post.comments = post.comments.filter(
        (comment) => comment._id.toString() !== commentId
      );
  
      await post.save();
  
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting comment", error });
    }
  };
  