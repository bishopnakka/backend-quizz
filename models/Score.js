// const mongoose = require("mongoose");
//questions lockeds this code coz i comment and write new logic
// const scoreSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },
//     userName: {
//       type: String,
//       required: true
//     },
//     score: {
//       type: Number,
//       required: true
//     },
//     total: {
//       type: Number,
//       required: true
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // ✅ ONE UNIQUE INDEX (ONLY HERE)
// scoreSchema.index({ userId: 1 }, { unique: true });

// module.exports = mongoose.model("Score", scoreSchema);

const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    userName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },

    // ✅ NEW FIELD (IMPORTANT)
    answeredQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);

