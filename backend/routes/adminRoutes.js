// backend/routes/adminRoutes.js
const express = require("express");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Apply both middlewares to all admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalConnections = await ConnectionRequest.countDocuments({
      status: "accepted",
    });
    const pendingRequests = await ConnectionRequest.countDocuments({
      status: "pending",
    });

    res.json({ totalUsers, activeUsers, totalConnections, pendingRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// GET /api/admin/users?q=...&course=...&year=...
router.get("/users", async (req, res) => {
  try {
    const { q, course, year, isActive } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: new RegExp(q, "i") },
        { email: new RegExp(q, "i") },
      ];
    }
    if (course) filter.course = new RegExp(course, "i");
    if (year) filter.year = new RegExp(year, "i");
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ users: users.map((u) => u.toSafeObject()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET /api/admin/users/:id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// PATCH /api/admin/users/:id/block
router.patch("/users/:id/block", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive; // toggle
    await user.save();
    res.json({ user: user.toSafeObject() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user status" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// GET /api/admin/connections?status=pending
router.get("/connections", async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const connections = await ConnectionRequest.find(filter)
      .populate("from")
      .populate("to")
      .sort({ createdAt: -1 });

    res.json({
      connections: connections.map((c) => ({
        id: c._id,
        from: c.from.toSafeObject(),
        to: c.to.toSafeObject(),
        status: c.status,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch connections" });
  }
});

module.exports = router;
