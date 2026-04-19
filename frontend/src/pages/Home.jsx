import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <section className="hero">
        <div>
          <h1 className="hero-title">
            Connect with{" "}
            <span className="hero-highlight">students who share your skills</span>,
            interests and ambition.
          </h1>
          <p className="hero-subtitle">
            SkillConnect is a peer network for students. Discover teammates for
            hackathons, project partners, study buddies, and mentors — all based
            on the skills you care about.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate(user ? "/dashboard" : "/register")}
            >
              {user ? "Go to Dashboard" : "Start Matching"}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate("/students")}
            >
              Browse Students
            </button>
          </div>
        </div>
        <aside className="hero-card">
          <h2 className="hero-card-title">Live campus snapshot</h2>
          <p className="card-subtitle">
            See how SkillConnect is linking students right now.
          </p>
          <div className="hero-stat-row">
            <span className="hero-stat-label">Active students</span>
            <span className="hero-stat-value">1,248</span>
          </div>
          <div className="hero-stat-row">
            <span className="hero-stat-label">Skills indexed</span>
            <span className="hero-stat-value">87</span>
          </div>
          <div className="hero-stat-row">
            <span className="hero-stat-label">Connections formed</span>
            <span className="hero-stat-value">3,942</span>
          </div>
        </aside>
      </section>

      <section className="section">
        <h2 className="section-title">Why students use SkillConnect</h2>
        <div className="card-grid">
          <article className="card">
            <h3 className="card-title">Find project partners</h3>
            <p className="card-subtitle">
              Filter by programming languages, tools and domains to assemble
              strong teams for class projects or hackathons.
            </p>
          </article>
          <article className="card">
            <h3 className="card-title">Build your skill graph</h3>
            <p className="card-subtitle">
              Showcase what you know and what you are learning — let others
              discover you for the right opportunities.
            </p>
          </article>
          <article className="card">
            <h3 className="card-title">Grow together</h3>
            <p className="card-subtitle">
              Join forces with peers preparing for the same exams, certifications
              or competitions and keep each other accountable.
            </p>
          </article>
        </div>
      </section>
    </>
  );
};

export default Home;