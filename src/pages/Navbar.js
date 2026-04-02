import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-brand">
        <div className="admin-navbar-logo">BR</div>
        <div className="admin-navbar-brand-text">
          <h2>BR Solar</h2>
          <p>Admin Panel</p>
        </div>
      </div>

      <nav className="admin-navbar-links">
        <NavLink
          to="/requests"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Customers / Requests
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            isActive ? "admin-nav-link active" : "admin-nav-link"
          }
        >
          Projects
        </NavLink>
      </nav>
    </header>
  );
}