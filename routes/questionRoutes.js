const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// GET QUESTIONS (NEWEST FIRST)
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().sort({ _id: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD QUESTION (VALIDATION)
router.post("/", async (req, res) => {
  const { question, options, answer } = req.body;

  if (
    !question ||
    !question.trim() ||
    !Array.isArray(options) ||
    options.length !== 4 ||
    options.some(opt => !opt || !opt.trim()) ||
    !answer ||
    !options.includes(answer)
  ) {
    return res.status(400).json({ message: "Invalid question data" });
  }

  try {
    const newQuestion = new Question({
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      answer: answer.trim()
    });

    await newQuestion.save();
    res.json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
