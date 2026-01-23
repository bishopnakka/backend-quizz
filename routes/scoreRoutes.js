const express = require("express");
const Score = require("../models/Score");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 *
 * USER SUBMITS SCORE (UPSERT + QUESTION TRACKING)
 *
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { score, total, answeredQuestions } = req.body;

    if (
      score === undefined ||
      total === undefined ||
      !Array.isArray(answeredQuestions)
    ) {
      return res.status(400).json({
        message: "Invalid score data"
      });
    }

    const savedScore = await Score.findOneAndUpdate(
      { 
        userId: req.user.id 
      },
      {
        userName: req.user.name,
        score,
        total,
        $addToSet: {
          answeredQuestions: { $each: answeredQuestions }
        }
      },
      {
        new: true,
        upsert: true
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
 * 
 * GET LOGGED-IN USER SCORE
 * 
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
 *
 * ADMIN VIEWS ALL SCORES
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
