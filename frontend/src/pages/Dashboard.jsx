import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchConnections, fetchStudents } from "../services/api.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [connRes, studentRes] = await Promise.all([
          fetchConnections(),
          fetchStudents({ limit: 4 }),
        ]);
        setConnections(connRes.connections || []);
        setSuggested(studentRes.students || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <section>
      <h1 className="section-title">Hi {user?.name?.split(" ")[0]}, welcome back 👋</h1>
      <p className="hero-subtitle">
        This is your SkillConnect dashboard. Keep track of your peer network and
        discover new students who match your skills.
      </p>

      <div className="dashboard-layout">
        <article className="card">
          <h2 className="card-title">Your connections</h2>
          <p className="card-subtitle">
            Students you have already connected with.
          </p>
          <div style={{ marginTop: "1rem" }}>
            {connections.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                You have no connections yet. Start by browsing students with
                overlapping skills.
              </p>
            )}
            {connections.map((conn) => (
              <div
                key={conn._id}
                style={{
                  padding: "0.6rem 0",
                  borderBottom: "1px solid #111827",
                }}
              >
                <div className="student-name">{conn.name}</div>
                <div className="student-meta">
                  {conn.course} • {conn.year}
                </div>
                <div className="tag-row">
                  {(conn.skills || []).slice(0, 4).map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h2 className="card-title">Suggested matches</h2>
          <p className="card-subtitle">
            A quick preview of students you may want to connect with.
          </p>
          <div style={{ marginTop: "1rem" }}>
            {suggested.map((s) => (
              <div
                key={s._id}
                style={{
                  padding: "0.6rem 0",
                  borderBottom: "1px solid #111827",
                }}
              >
                <div className="student-name">{s.name}</div>
                <div className="student-meta">
                  {s.course} • {s.year}
                </div>
                <div className="tag-row">
                  {(s.skills || []).slice(0, 3).map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {suggested.length === 0 && (
              <p style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                No suggestions yet. Once more students sign up, they will appear
                here.
              </p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default Dashboard;