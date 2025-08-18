import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Assets({ setAuth }) {
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Assigned");

  const API_URL = "http://127.0.0.1:8000/api/assets";

  // Fetch assets from backend
  const fetchAssets = async () => {
    try {
      const res = await axios.get(API_URL);
      setAssets(res.data);
    } catch (err) {
      console.error("Error fetching assets:", err);
      alert("Failed to fetch assets");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Open modal for adding asset
  const handleAdd = () => {
    setEditAsset(null);
    setName("");
    setStatus("Unassigned");
    setShowModal(true);
  };

  // Open modal for editing asset
  const handleEdit = (asset) => {
    setEditAsset(asset);
    setName(asset.name);
    setStatus(asset.status);
    setShowModal(true);
  };

  // Delete asset
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setAssets(assets.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting asset:", err);
      alert("Failed to delete asset");
    }
  };

  // Save new or updated asset
  const handleSave = async () => {
    if (!name) {
      alert("Asset name is required");
      return;
    }

    try {
      if (editAsset) {
        // Update asset
        const res = await axios.put(`${API_URL}/${editAsset.id}`, { name, status });
        setAssets(assets.map(a => (a.id === editAsset.id ? res.data : a)));
      } else {
        // Add new asset
        const res = await axios.post(API_URL, { name, status });
        setAssets([...assets, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving asset:", err);
      alert("Failed to save asset");
    }
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container mt-5">
        <h2>Asset Management</h2>
        <button className="btn btn-primary mb-3" onClick={handleAdd}>
          Add Asset
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(asset => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.status}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(asset)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(asset.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editAsset ? "Edit Asset" : "Add Asset"}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Asset Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option>Assigned</option>
                      <option>Unassigned</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
