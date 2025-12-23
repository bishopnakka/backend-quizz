const express = require("express");
const Score = require("../models/Score");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * ===============================
 * USER SUBMITS SCORE (UPSERT)
 * ===============================
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { score, total } = req.body;

    if (score === undefined || total === undefined) {
      return res.status(400).json({
        message: "Score data missing"
      });
    }

    // ✅ UPSERT: update if exists, insert if not
    const savedScore = await Score.findOneAndUpdate(
      { userId: req.user.id },   // find by user
      {
        userName: req.user.name,
        score,
        total
      },
      {
        new: true,
        upsert: true,           // 🔥 KEY FIX
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      message: "Score saved successfully",
      score: savedScore
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to save score",
      error: err.message
    });
  }
});

/**
 * ===============================
 * GET LOGGED-IN USER SCORE
 * ===============================
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const score = await Score.findOne({ userId: req.user.id });

    if (!score) {
      return res.status(404).json({ message: "No score found" });
    }

    res.json(score);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch score" });
  }
});

/**
 * ===============================
 * ADMIN VIEWS ALL SCORES
 * ===============================
 */
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const scores = await Score.find().sort({ updatedAt: -1 });
    return res.status(200).json(scores);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch scores",
      error: err.message
    });
  }
});

module.exports = router;
