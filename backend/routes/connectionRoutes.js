const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

const router = express.Router();

router.post("/:targetId", authMiddleware, async (req, res) => {
  try {
    const { targetId } = req.params;
    if (targetId === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot connect with yourself" });
    }

    const existing = await ConnectionRequest.findOne({
      from: req.user._id,
      to: targetId,
    });

    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const conn = await ConnectionRequest.create({
      from: req.user._id,
      to: targetId,
    });

    res.status(201).json({ connection: conn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send request" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const accepted = await ConnectionRequest.find({
      $or: [{ from: req.user._id }, { to: req.user._id }],
      status: "accepted",
    })
      .populate("from")
      .populate("to");

    const connections = accepted.map((c) => {
      const other = String(c.from._id) === String(req.user._id) ? c.to : c.from;
      return other.toSafeObject();
    });

    res.json({ connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
});

module.exports = router;