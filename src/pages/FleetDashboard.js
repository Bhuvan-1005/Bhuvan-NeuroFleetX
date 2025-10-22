import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import "./Dashboard.css";

const FleetDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { drivers = [], vehicles = [], telemetryRecords = [] } = useData();

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const stats = {
    totalDrivers: drivers.length,
    totalVehicles: vehicles.length,
    telemetryToday: telemetryRecords.filter(
      (r) => r.date === new Date().toISOString().split("T")[0]
    ).length,
  };

  return (
    <div className="dashboard-page">
      <Particles />
      <Navbar />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Fleet Dashboard</h1>
          <div className="header-actions">
            <div className="user-info">{currentUser?.email || "Manager"}</div>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalVehicles}</h3>
            <p>Vehicles Managed</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalDrivers}</h3>
            <p>Drivers Onboarded</p>
          </div>
          <div className="stat-card">
            <h3>{stats.telemetryToday}</h3>
            <p>Telemetry Events Today</p>
          </div>
        </section>

        <section className="lists-grid">
          <div className="panel">
            <h4>Vehicles</h4>
            <ul>
              {vehicles.slice(0, 10).map((v) => (
                <li key={v.id || v.vin}>
                  <strong>{v.model || v.vin}</strong> — {v.status || "ok"}
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h4>Drivers</h4>
            <ul>
              {drivers.slice(0, 10).map((d) => (
                <li key={d.id || d.driver_id}>
                  <strong>{d.name}</strong> — {d.status || "active"}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>NeuroFleetX — AI-Driven Urban Mobility Optimization</span>
          <span>{now.toLocaleString()}</span>
        </footer>
      </main>
    </div>
  );
};

export default FleetDashboard;
