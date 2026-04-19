import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  course: "",
  year: "",
  bio: "",
  skills: "",
};

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const res = await register(payload);
    if (res.ok) {
      navigate("/dashboard");
    } else {
      setError(res.message);
    }
  };

  return (
    <section className="form-card">
      <h1 className="form-title">Create your profile</h1>
      <p className="form-subtitle">
        Tell us who you are and which skills you want to connect on.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            name="name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Moulik Maharjan"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            College email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@college.edu"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            value={form.password}
            onChange={handleChange}
            placeholder="Choose a strong password"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="course">
            Course / Program
          </label>
          <input
            id="course"
            name="course"
            className="form-input"
            value={form.course}
            onChange={handleChange}
            placeholder="MCA, B.Tech CSE, BCA..."
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="year">
            Year / Semester
          </label>
          <input
            id="year"
            name="year"
            className="form-input"
            value={form.year}
            onChange={handleChange}
            placeholder="2nd year, 4th sem..."
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="skills">
            Key skills (comma separated)
          </label>
          <input
            id="skills"
            name="skills"
            className="form-input"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Python, Machine Learning, UI/UX"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bio">
            Short bio
          </label>
          <textarea
            id="bio"
            name="bio"
            className="form-textarea"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell your peers what you love working on..."
          />
        </div>
        {error && (
          <p style={{ color: "#fca5a5", fontSize: "0.85rem" }}>{error}</p>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <div className="form-footer">
        <span>Already on SkillConnect?</span>
        <Link to="/login" className="link">
          Log in
        </Link>
      </div>
    </section>
  );
};

export default Register;