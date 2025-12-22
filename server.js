const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ROUTES
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

// INIT APP
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// DEBUG (optional)
app.use((req, res, next) => {
  console.log("Request from origin:", req.headers.origin);
  next();
});

// ROUTES
app.use("/questions", questionRoutes);
app.use("/auth", authRoutes);
app.use("/scores", scoreRoutes);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
