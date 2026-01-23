const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// JSON Middleware
app.use(express.json());

//  Allowed Frontend Origins
const allowedOrigins = [
  "https://poulraju.vercel.app", // Your main frontend
  "https://poulraju-git-master-n-bishops-projects.vercel.app", // Preview deploy
  "https://frontend-quizz.netlify.app",
  "http://localhost:3000"
];

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(" Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

// Debug Logs
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  next();
});

// Routes Import
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

// Route Usage
app.use("/questions", questionRoutes);
app.use("/auth", authRoutes);
app.use("/scores", scoreRoutes);

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.error(" DB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(` Backend Live at http://localhost:${PORT}`)
);
