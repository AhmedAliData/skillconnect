// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },

    course: { type: String },
    year: { type: String },
    bio: { type: String },

    skills: [{ type: String }],

    // ⭐ ROLE FIELD (student / admin)
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    // For blocking users without deleting
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// What we send back to frontend
userSchema.methods.toSafeObject = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    course: this.course,
    year: this.year,
    bio: this.bio,
    skills: this.skills,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
