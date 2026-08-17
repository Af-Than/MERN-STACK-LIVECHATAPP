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

// Configure CORS for Express routes
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("The backend is working fine");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Error Handling Middleware 
app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Socket.io Setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      console.log("User joined room: " + userData._id);
      socket.emit("connected");
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room: " + room);
  });

  // Consolidated Single Typing Listener
  socket.on("typing", (data) => {
    if (typeof data === "object" && data.room) {
      socket.in(data.room).emit("typing", data.user ? data.user.name : "Someone");
    } else {
      socket.in(data).emit("typing", "Someone");
    }
  });

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat || !chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message received", newMessageRecieved);
    });
  });

  socket.off("setup", (userData) => {
    console.log("User disconnected");
    socket.leave(userData._id);
  });
});