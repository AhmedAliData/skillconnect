import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: "",
    course: "",
    year: "",
    skills: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile();
        const profile = res.user || {};
        setForm({
          name: profile.name || "",
          course: profile.course || "",
          year: profile.year || "",
          skills: (profile.skills || []).join(", "),
          bio: profile.bio || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await updateProfile(payload);
      setStatus("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="form-card">
      <h1 className="form-title">Your profile</h1>
      <p className="form-subtitle">
        Keep your information and skills up to date so other students can find
        you easily.
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
          />
        </div>
        {status && (
          <p style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}>{status}</p>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem" }}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
      <div className="form-footer">
        <span>Want to start over?</span>
        <button
          type="button"
          className="nav-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default Profile;