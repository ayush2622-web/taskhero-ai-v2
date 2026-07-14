const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes=require("./routes/taskRoutes");
const analyticsRoutes=require("./routes/analyticsRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks",taskRoutes);
app.use("/api/analytics",analyticsRoutes);

app.get("/", (req, res) => {
  res.send("TaskHero AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});