import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="form-card">
      <h1 className="form-title">Page not found</h1>
      <p className="form-subtitle">
        The page you are looking for does not exist. Use the navigation bar or
        go back home.
      </p>
      <Link to="/" className="btn btn-primary" style={{ textAlign: "center" }}>
        Go home
      </Link>
    </section>
  );
};

export default NotFound;