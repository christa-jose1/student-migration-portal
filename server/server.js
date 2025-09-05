// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");

// const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/Post");
// const chatRoutes = require("./routes/chat"); // Add chat routes
// const userRoutes = require("./routes/user"); // Add chat routes
// const courseRoutes = require("./routes/course");


// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/Post", postRoutes);
// app.use("/api/chat", chatRoutes(io)); // Pass io to chat routes
// app.use("/api/users", userRoutes); // Added users route
// app.use("/api/courses", courseRoutes);

// // Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log("✅ New client connected:", socket.id);

//   // Join user's own room based on their userId
//   socket.on('join', (userId) => {
//     socket.join(userId.toString());
//     console.log(`User ${userId} joined their room`);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Client disconnected:", socket.id);
//   });
// });

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected...");
//     server.listen(5000, () => console.log("🚀 Server running on port 5000"));
//   })
//   .catch((error) => console.error("❌ MongoDB Connection Error:", error));


// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const http = require("http");
// const { Server } = require("socket.io");
// const bodyParser = require("body-parser");

// const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/Post");
// const chatRoutes = require("./routes/chat");
// const userRoutes = require("./routes/user");
// const courseRoutes = require("./routes/course");
// const faqRoutes = require("./routes/faqRoutes");
// const guideRoutes = require("./routes/guideRoutes");

// dotenv.config();

// const app = express();
// const server = http.createServer(app);

// // Increase payload size limit to fix "PayloadTooLargeError"
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// app.use("/uploads", express.static("uploads")); // Serve uploaded files

// // CORS configuration
// app.use(cors({
//   origin: process.env.FRONTEND_URL || "http://localhost:5173",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true, 
// }));

// app.use("/uploads", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// // Socket.IO setup
// const io = new Server(server, {
//   cors: {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes); // Fixed route name
// app.use("/api/chat", chatRoutes(io)); // Pass io to chat routes
// app.use("/api/users", userRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/faqs", faqRoutes);
// app.use("/api/guides", guideRoutes);

// // Socket.IO connection handling
// io.on("connection", (socket) => {
//   console.log(`✅ New client connected: ${socket.id}`);

//   // Join user's own room based on their userId
//   socket.on("join", (userId) => {
//     socket.join(userId.toString());
//     console.log(`User ${userId} joined their room`);
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ Client disconnected: ${socket.id}`);
//   });
// });

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("✅ MongoDB Connected...");
//     const PORT = process.env.PORT || 5000;
//     server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((error) => console.error("❌ MongoDB Connection Error:", error));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
// const postRoutes = require("./routes/Post");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const faqRoutes = require("./routes/faqRoutes");
const guideRoutes = require("./routes/guideRoutes");
const postRoutes = require("./routes/postRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Increase payload size limit to fix "PayloadTooLargeError"
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ✅ Proper CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};
app.use(cors(corsOptions));

// ✅ Set CORS headers for static file serving (Fixes file download issue)
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes(io));
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/posts", postRoutes);

// ✅ Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`✅ New client connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected...");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));
