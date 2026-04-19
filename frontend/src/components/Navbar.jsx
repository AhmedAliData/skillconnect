import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        Skill<span>Connect</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        {user && (
          <>
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>
            <NavLink to="/students" className="nav-link">
              Browse
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
            {/* ⭐ only for admin */}
            {user.role === "admin" && (
              <NavLink to="/admin" className="nav-link">
                Admin
              </NavLink>
            )}
          </>
        )}
        {!user ? (
          <>
            <button
              className="nav-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="nav-button primary"
              onClick={() => navigate("/register")}
            >
              Join Now
            </button>
          </>
        ) : (
          <button className="nav-button primary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
