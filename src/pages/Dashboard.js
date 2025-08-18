import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ setAuth }) {
  const [stats, setStats] = useState({
    total_assets: 0,
    assigned: 0,
    unassigned: 0,
    maintenance_due: 0,
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching stats", err));
  }, []);

  const maintenanceData = {
    labels: ["Pending", "Resolved"],
    datasets: [
      {
        data: [stats.maintenance_due, stats.total_assets - stats.maintenance_due],
        backgroundColor: ["#dc3545", "#28a745"],
        hoverBackgroundColor: ["#c82333", "#218838"],
      },
    ],
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container mt-5">
        <h2 className="mb-4">Dashboard</h2>
        <div className="row">
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Total Assets</h5>
                <p className="card-text fs-4">{stats.total_assets}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Assigned</h5>
                <p className="card-text fs-4">{stats.assigned}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3">
              <div className="card-body">
                <h5 className="card-title">Unassigned</h5>
                <p className="card-text fs-4">{stats.unassigned}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3">
              <div className="card-body">
                <h5 className="card-title">Maintenance Due</h5>
                <p className="card-text fs-4">{stats.maintenance_due}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h4>Maintenance Status</h4>
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Pie data={maintenanceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
