import React, { useState } from "react";
import { Container, TextField, Button, Card, CardContent, Typography, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder, Comment } from "@mui/icons-material";

interface Post {
  id: number;
  content: string;
  likes: number;
  comments: string[];
}

const dummyPosts: Post[] = [
  { id: 1, content: "Learning React is fun!", likes: 5, comments: ["Absolutely!", "I love React."] },
  { id: 2, content: "Material UI makes styling easy.", likes: 8, comments: ["Indeed, it's super convenient!"] },
  { id: 3, content: "How do you handle state management?", likes: 3, comments: ["Redux is great!", "Context API works well too."] }
];

const Post = () => {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [newPost, setNewPost] = useState("");
  const [comment, setComment] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});

  const handleAddPost = () => {
    if (newPost.trim() === "") return;
    const newEntry: Post = {
      id: Date.now(),
      content: newPost,
      likes: 0,
      comments: []
    };
    setPosts([newEntry, ...posts]);
    setNewPost("");
  };

  const handleAddComment = (postId: number) => {
    if (comment[postId]?.trim() === "") return;
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, comments: [...post.comments, comment[postId]] } : post
    ));
    setComment({ ...comment, [postId]: "" });
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const toggleComments = (postId: number) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <Container maxWidth="sm">
      {posts.map((post) => (
        <Card key={post.id} style={{ marginTop: 20 }}>
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
            <IconButton onClick={() => handleLike(post.id)}>
              {post.likes > 0 ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="caption">{post.likes} Likes</Typography>
            <IconButton onClick={() => toggleComments(post.id)}>
              <Comment />
            </IconButton>
            {showComments[post.id] && (
              <>
                <TextField
                  label="Add a comment"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={comment[post.id] || ""}
                  onChange={(e) => setComment({ ...comment, [post.id]: e.target.value })}
                  margin="normal"
                />
                <Button size="small" onClick={() => handleAddComment(post.id)}>Comment</Button>
                {post.comments.map((c, index) => (
                  <Typography key={index} variant="body2" style={{ marginLeft: 10 }}>
                    - {c}
                  </Typography>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Post;