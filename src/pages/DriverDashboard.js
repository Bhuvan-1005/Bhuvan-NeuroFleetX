import React from "react";
import FleetDashboard from "./FleetDashboard";

// Simple wrapper for driver dashboard while migrating names
const DriverDashboard = () => {
  return (
    <div>
      <h2 className="page-title">Driver Console</h2>
      <FleetDashboard />
    </div>
  );
};

export default DriverDashboard;
