// backend/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔐 Special admin credentials (fixed)
const ADMIN_EMAIL = "admin@skillconnect.com";
const ADMIN_PASSWORD = "SkillConnectAdmin123";

const createToken = (user) => {
  // include role in token payload (helpful for middleware later)
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ---------------------- REGISTER ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, course, year, bio, skills = [] } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      course,
      year,
      bio,
      skills,
      // role defaults to "student"
    });

    const token = createToken(user);
    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ----------------------- LOGIN ------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // ⭐ SPECIAL ADMIN LOGIN
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // find or create admin user
      let adminUser = await User.findOne({ email: ADMIN_EMAIL });

      if (!adminUser) {
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        adminUser = await User.create({
          name: "Super Admin",
          email: ADMIN_EMAIL,
          passwordHash,
          course: "Admin",
          year: "N/A",
          bio: "Platform administrator",
          skills: [],
          role: "admin",
        });
      }

      const token = createToken(adminUser);
      return res.json({ user: adminUser.toSafeObject(), token });
    }

    // 👇 Normal student login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    res.json({ user: user.toSafeObject(), token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
