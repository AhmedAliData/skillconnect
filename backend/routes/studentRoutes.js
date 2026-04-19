const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { q, skill, limit = 20 } = req.query;
    const filter = { _id: { $ne: req.user._id } };

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { course: new RegExp(q, "i") },
        { year: new RegExp(q, "i") },
      ];
    }

    if (skill) {
      filter.skills = { $in: [new RegExp("^" + skill + "$", "i")] };
    }

    const students = await User.find(filter).limit(Number(limit));
    res.json({ students: students.map((u) => u.toSafeObject()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, course, year, bio, skills } = req.body;
    if (name !== undefined) req.user.name = name;
    if (course !== undefined) req.user.course = course;
    if (year !== undefined) req.user.year = year;
    if (bio !== undefined) req.user.bio = bio;
    if (skills !== undefined) req.user.skills = skills;
    await req.user.save();
    res.json({ user: req.user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;