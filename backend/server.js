const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/users");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());//to accept json data
app.use(cors());
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use("/api/users",userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});