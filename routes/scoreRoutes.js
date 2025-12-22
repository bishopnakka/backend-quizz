const express = require("express");
const Score = require("../models/Score");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// USER SUBMITS SCORE
router.post("/", verifyToken, async (req, res) => {
  try {
    const { score, total } = req.body;

    if (score === undefined || total === undefined) {
      return res.status(400).json({ message: "Score data missing" });
    }

    await Score.create({
      userId: req.user.id,
      userName: req.user.name,
      score,
      total
    });

    res.json({ message: "Score saved successfully" });
  } catch {
    res.status(500).json({ message: "Failed to save score" });
  }
});

// ADMIN VIEWS SCORES
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 });
    res.json(scores);
  } catch {
    res.status(500).json({ message: "Failed to fetch scores" });
  }
});

module.exports = router;
