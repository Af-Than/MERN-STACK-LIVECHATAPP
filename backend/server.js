const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/chats");
const messageRoutes = require("./routes/messages");

const { notFound, errorHandler } = require("./middleware/error");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
  "https://mern-stack-livechatapp.vercel.app",
  "https://mern-stack-livechatapp-e99gqru22-affu.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

// ======================================================
// PORT
// ======================================================

const port = process.env.PORT || 5000;

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
  res.send("The backend is working fine");
});

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// ======================================================
// ERROR HANDLING
// ======================================================

app.use(notFound);
app.use(errorHandler);

// ======================================================
// START SERVER
// ======================================================

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ======================================================
// SOCKET.IO
// ======================================================

const io = require("socket.io")(server, {
  pingTimeout: 60000,

  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ======================================================
// SOCKET CONNECTION
// ======================================================

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Setup user
  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);

      console.log("User joined room: " + userData._id);

      socket.emit("connected");
    }
  });

  // Join chat room
  socket.on("join chat", (room) => {
    socket.join(room);

    console.log("User joined room: " + room);
  });

  // Typing
  socket.on("typing", (data) => {
    if (typeof data === "object" && data.room) {
      socket
        .in(data.room)
        .emit(
          "typing",
          data.user ? data.user.name : "Someone"
        );
    } else {
      socket
        .in(data)
        .emit("typing", "Someone");
    }
  });

  // Stop typing
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // New message
  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat || !chat.users) {
      console.log("chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (
        user._id ===
        newMessageRecieved.sender._id
      ) {
        return;
      }

      socket
        .in(user._id)
        .emit(
          "message received",
          newMessageRecieved
        );
    });
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});