import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/Dashboard";
import AlumniDashboard from "./pages/alumni/Dashboard";
import TnpDashboard from "./pages/tnp/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";

import ProtectedRoute from "./utils/ProtectedRoute";

// import './App.css';
import './styles/theme.css';

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alumni/dashboard"
        element={
          <ProtectedRoute allowedRole="alumni">
            <AlumniDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <TnpDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

