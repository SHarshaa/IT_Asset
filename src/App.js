import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Assignments from "./pages/Assignments";
import Maintenance from "./pages/Maintenance";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setAuth={setIsAuthenticated} />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/assets"
          element={isAuthenticated ? <Assets setAuth={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route 
          path="/assignments" 
          element={isAuthenticated ? <Assignments setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
        <Route 
          path="/maintenance" 
          element={isAuthenticated ? <Maintenance setAuth={setIsAuthenticated} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
