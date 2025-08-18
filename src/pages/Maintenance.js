import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Form, Button, Table } from "react-bootstrap";
import axios from "axios";

export default function Maintenance({ setAuth }) {
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: "",
    description: "",
    date: "",
    dueDate: "",
    status: "Pending",
  });

  const API_URL = "http://127.0.0.1:8000/api";

  const fetchData = async () => {
    try {
      const [maintenanceRes, assetRes] = await Promise.all([
        axios.get(`${API_URL}/maintenances`),
        axios.get(`${API_URL}/assets`)
      ]);
      setMaintenanceLogs(maintenanceRes.data);
      setAssets(assetRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/maintenances`, {
        asset_id: formData.asset_id,
        description: formData.description,
        date: formData.date,
        due_date: formData.dueDate,
        status: formData.status,
      });
      setFormData({ asset_id: "", description: "", date: "", dueDate: "", status: "Pending" });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to log maintenance");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/maintenances/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="container mt-4">
        <h2>Log Maintenance</h2>
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Asset</Form.Label>
            <Form.Select
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Asset</option>
              {assets.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe maintenance"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Maintenance Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Expected Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">Log Maintenance</Button>
        </Form>

        <h3>Maintenance History</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Description</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.asset?.name}</td>
                <td>{log.description}</td>
                <td>{log.date}</td>
                <td>{log.due_date}</td>
                <td>
                  <Form.Select
                    value={log.status}
                    onChange={(e) => handleStatusChange(log.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
