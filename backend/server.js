const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/users");
const chatRoutes = require("./routes/chats"); // 👈 1. Import chat routes
const { notFound, errorHandler } = require("./middleware/error");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json()); // to accept json data
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes); // 👈 2. Mount chat routes BEFORE error middleware

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});