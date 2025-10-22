import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Landing from "./pages/Landing";
import FleetManagerSignup from "./pages/FleetManagerSignup";
import FleetManagerLogin from "./pages/FleetManagerLogin";
import DriverLogin from "./pages/DriverLogin";
import FleetDashboard from "./pages/FleetDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import DataManagementDashboard from "./pages/DataManagementDashboard";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />

              {/* NeuroFleetX routes */}
              <Route path="/fleet-login" element={<FleetManagerLogin />} />
              <Route path="/fleet-signup" element={<FleetManagerSignup />} />
              <Route path="/driver-login" element={<DriverLogin />} />

              <Route
                path="/fleet-dashboard"
                element={
                  <ProtectedRoute role="teacher">
                    <FleetDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/driver-dashboard"
                element={
                  <ProtectedRoute role="student">
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Public Data Management Dashboard */}
              <Route
                path="/data-management"
                element={<DataManagementDashboard />}
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
