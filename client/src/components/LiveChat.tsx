import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import moment from "moment";
import { SocketContext } from "../socketConfig/socketContext";

interface PrivateChatProps {
  chatId: string | null;
  currentUserId: string;
}

interface Message {
  _id?: string;
  senderId: string;
  content: string;
  createdAt?: string;
  isRead?: boolean;
  attachment?: string | null; // Added to match schema
  username?: string; // From population
}

interface Chat {
  _id: string;
  participants: { _id: string; username: string }[];
  messages: Message[];
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

const PrivateChat: React.FC<PrivateChatProps> = ({ chatId, currentUserId }) => {
  console.log("chatId", chatId);
  console.log("currentUserId", currentUserId);
  const uid = sessionStorage.getItem("mongoId");

  const context = useContext(SocketContext);
  const socket = context?.socket;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    fetchChatMessages();
  }, [chatId]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = ({
      chatId: incomingChatId,
      message,
    }: {
      chatId: string;
      message: Message;
    }) => {
      console.log(incomingChatId, chatId);

      if (incomingChatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleChatDeleted = (deletedChatId: string) => {
      if (deletedChatId === chatId) {
        setMessages([]);
      }
    };

    socket.on("newMessage", fetchChatMessages);
    socket.on("chatDeleted", handleChatDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("chatDeleted", handleChatDeleted);
    };
  }, [socket, chatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get<Chat>(
        `http://localhost:5000/api/chat/${chatId}`
      );
      setMessages(res.data.messages || []);
    } catch (error) {
      console.log("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      await axios.put(`http://localhost:5000/api/chat/${chatId}/message`, {
        senderId: sessionStorage.getItem("mongoId"),
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const getMessageDate = (timestamp?: string): string => {
    if (!timestamp) return "Today";
    return moment(timestamp).calendar(null, {
      sameDay: "[Today]",
      lastDay: "[Yesterday]",
      lastWeek: "dddd",
      sameElse: "MMMM D, YYYY",
    });
  };

  const renderMessages = () => {
    let currentDate: string | null = null;
    return messages.map((msg, index) => {
      const messageDate = getMessageDate(msg.createdAt);
      const showDateDivider = messageDate !== currentDate;

      if (showDateDivider) {
        currentDate = messageDate;
      }

      return (
        <React.Fragment key={msg._id || index}>
          {showDateDivider && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.05)",
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                {messageDate}
              </Typography>
            </Box>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ListItem
              sx={{
                justifyContent:
                  msg.senderId?._id === uid ? "flex-end" : "flex-start",
                alignItems: "flex-start",
                gap: "6px",
                padding: "4px 0",
              }}
            >
              {msg.senderId?._id !== uid && (
                <ListItemAvatar sx={{ minWidth: 36 }}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(25, 118, 210, 0.12)",
                      color: "primary.main",
                      width: 32,
                      height: 32,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {msg.username?.[0] || "U"}
                  </Avatar>
                </ListItemAvatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  backgroundColor:
                    msg.senderId._id === uid ? "primary.main" : "grey.100",
                  color: msg.senderId._id === uid ? "white" : "text.primary",
                  padding: "10px 14px",
                  borderRadius:
                    msg.senderId === uid
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  maxWidth: "70%",
                  position: "relative",
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {msg.content}
                </Typography>
                {msg.attachment && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Attachment: <a href={msg.attachment}>{msg.attachment}</a>
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    textAlign: "right",
                    color:
                      msg.senderId === currentUserId
                        ? "rgba(255,255,255,0.7)"
                        : "text.secondary",
                    fontSize: "0.7rem",
                  }}
                >
                  {msg.createdAt
                    ? moment(msg.createdAt).format("h:mm A")
                    : "Just now"}
                </Typography>
              </Paper>
            </ListItem>
          </motion.div>
        </React.Fragment>
      );
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "400px",
        margin: "20px auto",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <Box
        sx={{
          padding: "14px 16px",
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ChatIcon sx={{ fontSize: "1.2rem", mr: 1.5 }} />
        <Typography variant="subtitle1" fontWeight="600">
          Private Chat
        </Typography>
      </Box>

      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          backgroundColor: "#ffffff",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "3px",
          },
        }}
      >
        <AnimatePresence>
          {messages.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 0.6,
              }}
            >
              <ChatIcon
                sx={{ fontSize: "3rem", color: "text.disabled", mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            renderMessages()
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </List>

      <Divider />

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: "flex",
          gap: "10px",
          padding: "12px 16px",
          backgroundColor: "#ffffff",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewMessage(e.target.value)
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "28px",
              fontSize: "0.9rem",
              backgroundColor: "grey.50",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.light",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "primary.main",
                borderWidth: "1px",
              },
              "& .MuiOutlinedInput-input": {
                padding: "12px 16px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0,0,0,0.08)",
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            width: 42,
            height: 42,
            borderRadius: "50%",
            "&:hover": { backgroundColor: "primary.dark" },
            transition: "all 0.2s",
            "&:disabled": {
              backgroundColor: "action.disabledBackground",
              color: "action.disabled",
            },
          }}
          disabled={!newMessage.trim()}
        >
          <SendRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PrivateChat;
