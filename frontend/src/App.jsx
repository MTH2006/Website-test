import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClusterManagement from './pages/ClusterManagement';
import TeamManagement from './pages/TeamManagement';
import ResourceManagement from './pages/ResourceManagement';
import ApplicationManagement from './pages/ApplicationManagement';
import SecurityPolicies from './pages/SecurityPolicies';
import DemoLab from './pages/DemoLab';
import DemoHistory from './pages/DemoHistory';
import Reports from './pages/Reports';
import SystemSettings from './pages/SystemSettings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#070b19] text-white">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Đang tải nền tảng Mini CaaS...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes inside MainLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="cluster" element={<ClusterManagement />} />
        <Route path="teams" element={<TeamManagement />} />
        <Route path="resources" element={<ResourceManagement />} />
        <Route path="applications" element={<ApplicationManagement />} />
        <Route path="security" element={<SecurityPolicies />} />
        <Route path="demo-lab" element={<DemoLab />} />
        <Route path="history" element={<DemoHistory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
