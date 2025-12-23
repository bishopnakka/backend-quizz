const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

/**
 * ===============================
 * GET ALL QUESTIONS (NEWEST FIRST)
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: -1 });
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch questions",
      error: err.message
    });
  }
});

/**
 * ===============================
 * ADD NEW QUESTION (WITH VALIDATION)
 * ===============================
 */
router.post("/", async (req, res) => {
  const { question, options, answer } = req.body;

  // 🔒 Validation
  if (
    !question ||
    !question.trim() ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    options.some(opt => !opt || !opt.trim()) ||
    !answer ||
    !options.includes(answer)
  ) {
    return res.status(400).json({
      message: "Invalid question data"
    });
  }

  try {
    const newQuestion = new Question({
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      answer: answer.trim()
    });

    await newQuestion.save();

    return res.status(201).json(newQuestion);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add question",
      error: err.message
    });
  }
});

module.exports = router;
