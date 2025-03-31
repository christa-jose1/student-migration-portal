import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListItem,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import PrivateChat from "./LiveChat";

interface User {
  _id: string;
  name: string;
}

const UsersPage: React.FC = () => {
  const currentUserId = sessionStorage.getItem("mongoId") || "";
  const [users, setUsers] = useState<User[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>("http://localhost:5000/api/users");
        // Filter out the current user
        setUsers(res.data.filter((user) => user._id !== currentUserId));
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  // Start a new chat
  const startPrivateChat = async (otherUserId: string) => {
    try {
      const res = await axios.post("http://localhost:5000/api/chat/create", {
        participantIds: [currentUserId, otherUserId],
      });

      setSelectedChatId(res.data._id); // Open chat window
    } catch (error) {
      console.error("Error starting private chat:", error);
      setError("Failed to start chat");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#121212",
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: "300px",
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#1e1e1e",
          color: "white",
          padding: 2,
          borderRadius:"20px"
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        All Users
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <List>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <ListItem
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    padding: "10px",
                    borderRadius: "10px",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                  onClick={() => startPrivateChat(user._id)}
                >
                  <Avatar sx={{ bgcolor: "blue" }}>
                    {user.name ? user.name[0] : "?"}
                  </Avatar>
                  <Typography>{user.name || "Unknown User"}</Typography>
                </ListItem>

                <Divider sx={{ backgroundColor: "#444" }} />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Chat Window */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: "#222",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
           borderRadius:"20px" 
        }}
      >
        {selectedChatId ? (
          <PrivateChat chatId={selectedChatId} currentUserId={currentUserId} />
        ) : (
          <Typography variant="h6" sx={{ opacity: 0.7,width:'20rem',display:"flex",justifyContent:'center' }}>
            Select a user to start chatting
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default UsersPage;
