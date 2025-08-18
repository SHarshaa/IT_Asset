import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ setAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          IT Asset Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
            <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/assets">Assets</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/assignments">Assignments</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/maintenance">Maintenance</Link>
            </li>
        </ul>

          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
