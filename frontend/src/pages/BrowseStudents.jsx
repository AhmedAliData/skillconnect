import React, { useEffect, useState } from "react";
import { fetchStudents, sendConnectionRequest } from "../services/api.js";

const BrowseStudents = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchStudents();
        setStudents(res.students || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = {};
    if (query) params.q = query;
    if (filterSkill) params.skill = filterSkill;
    try {
      const res = await fetchStudents(params);
      setStudents(res.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnect = async (id) => {
    setSendingId(id);
    try {
      await sendConnectionRequest(id);
      alert("Connection request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    } finally {
      setSendingId(null);
    }
  };

  return (
    <section>
      <h1 className="section-title">Browse students</h1>
      <p className="hero-subtitle">
        Use filters to find peers with specific skills or interests.
      </p>

      <form
        onSubmit={handleSearch}
        style={{
          marginTop: "1.3rem",
          display: "flex",
          gap: "0.7rem",
          flexWrap: "wrap",
        }}
      >
        <input
          className="form-input"
          style={{ maxWidth: "260px" }}
          placeholder="Search by name, course..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="form-input"
          style={{ maxWidth: "220px" }}
          placeholder="Filter by skill e.g. React"
          value={filterSkill}
          onChange={(e) => setFilterSkill(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      <div className="student-grid" style={{ marginTop: "1.5rem" }}>
        {students.length === 0 && (
          <p style={{ color: "#9ca3af" }}>
            No students matched your filters yet.
          </p>
        )}
        {students.map((s) => (
          <article key={s._id} className="student-card">
            <div className="student-name">{s.name}</div>
            <div className="student-meta">
              {s.course} • {s.year}
            </div>
            <p
              style={{
                marginTop: "0.4rem",
                fontSize: "0.85rem",
                color: "#d1d5db",
              }}
            >
              {s.bio}
            </p>
            <div className="tag-row">
              {(s.skills || []).map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
            <div className="student-actions">
              <button
                className="btn btn-outline"
                onClick={() => handleConnect(s._id)}
                disabled={sendingId === s._id}
              >
                {sendingId === s._id ? "Sending..." : "Connect"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BrowseStudents;