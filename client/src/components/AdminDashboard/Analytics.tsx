import React, { useEffect, useState } from "react";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";

const API_URL = "http://localhost:5000/api/posts";

interface ReportedComment {
  commentId: string;
  postId: string;
  postTitle: string;
  user: { _id: string; name: string; email: string };
  text: string;
  createdAt: string;
}

const Analytics: React.FC = () => {
  const [reportedComments, setReportedComments] = useState<ReportedComment[]>([]);

  useEffect(() => {
    fetchReportedComments();
  }, []);

  const fetchReportedComments = async () => {
    try {
      const response = await fetch(`${API_URL}/comments/reported`);
      const data = await response.json();
      setReportedComments(data);
    } catch (error) {
      console.error("Error fetching reported comments:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
      });
      setReportedComments(reportedComments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        Reported Comments Analytics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Post Title</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Comment</strong></TableCell>
              <TableCell><strong>Reported At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportedComments.map((comment) => (
              <TableRow key={comment.commentId}>
                <TableCell>{comment.postTitle}</TableCell>
                <TableCell>{comment.user.name} ({comment.user.email})</TableCell>
                <TableCell>{comment.text}</TableCell>
                <TableCell>{new Date(comment.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="error" onClick={() => handleDeleteComment(comment.commentId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Analytics;

