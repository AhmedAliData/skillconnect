import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <section className="page admin-page">
      <h1>Admin Panel</h1>
      <p className="subtitle">
        Welcome, {user?.name}. This is the admin view – students cannot see this.
      </p>

      <div className="admin-grid">
        <div className="card">
          <h2>Platform Overview</h2>
          <p>Here you will later see stats like total users, active users, etc.</p>
        </div>
        <div className="card">
          <h2>User Management</h2>
          <p>Manage students, block / unblock accounts, and more.</p>
        </div>
        <div className="card">
          <h2>Connection Monitoring</h2>
          <p>Review connection requests and network activity.</p>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
