import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(form.email, form.password);

    if (res.ok) {
      const loggedInUser = res.user;

      if (loggedInUser?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <section className="form-card">
      <h1 className="form-title">Welcome back</h1>
      <p className="form-subtitle">
        Log in to see your dashboard and connect with students.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            College email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            placeholder="you@college.edu"
            value={form.email}
            onChange={handleChange}
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
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="form-footer">
        <span>New here?</span>
        <Link to="/register" className="link">
          Create an account
        </Link>
      </div>
    </section>
  );
};

export default Login;
