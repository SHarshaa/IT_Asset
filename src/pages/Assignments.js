import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
//import { API_URI } from "./api";

export default function Assignments({ setAuth }) {
  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetId, setAssetId] = useState("");
  const [employee, setEmployee] = useState("");

  const API_URL = "http://127.0.0.1:8000/api";

  // Fetch assignments and unassigned assets
  const fetchData = async () => {
    try {
      const [assignmentRes, assetRes] = await Promise.all([
        axios.get(`${API_URL}/assignments`),
        axios.get(`${API_URL}/assignments/unassigned-assets`)
      ]);
      setAssignments(assignmentRes.data);
      setAssets(assetRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!assetId || !employee) return alert("Please select both fields");

    try {
      await axios.post(`${API_URL}/assignments`, { asset_id: assetId, employee });
      setEmployee("");
      setAssetId("");
      fetchData(); // Refresh assignments and unassigned assets
    } catch (err) {
      console.error(err);
      alert("Failed to assign asset");
    }
  };

  // ⭐ New function to unassign asset
  const handleUnassign = async (id) => {
    try {
      await axios.post(`${API_URL}/assignments/${id}/unassign`);
      fetchData(); // Refresh after unassign
    } catch (err) {
      console.error(err);
      alert("Failed to unassign asset");
    }
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container mt-5">
        <h2>Assignment Module</h2>
        
        <div className="card p-3 mb-4">
          <h5>Assign Asset</h5>
          <div className="row">
            <div className="col">
              <select className="form-select" value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                <option value="">Select Asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Employee Name"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              />
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={handleAssign}>Assign</button>
            </div>
          </div>
        </div>

        <h5>Assignment History</h5>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Employee</th>
              <th>Date Assigned</th>
              <th>Date Unassigned</th>
              <th>Action</th> {/* ⭐ New column */}
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.asset.name}</td>
                <td>{a.employee}</td>
                <td>{a.date_assigned}</td>
                <td>{a.date_unassigned || "-"}</td>
                <td>
                  {/* Show Unassign button only if still assigned */}
                  {!a.date_unassigned && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUnassign(a.id)}
                    >
                      Unassign
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
