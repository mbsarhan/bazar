// admin-panel/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ManageAds from './components/admin/ManageAds';
import AdminDashboard from './components/admin/AdminDashboard'; // 1. Import the real component
import ManageUsers from './components/admin/ManageUsers'; // Also import this for completeness
import './styles/forms.css';

const ProtectedRoute = () => {
    const { admin, isLoading } = useAuth();
    if (isLoading) { return <p>Loading session...</p>; }
    return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
    const { admin, isLoading } = useAuth();
    if (isLoading) { return <p>Loading...</p>; }
    return admin ? <Navigate to="/" replace /> : <Outlet />;
};

// The old placeholder has been removed.

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              
              {/* --- THIS IS THE GUARANTEED FIX --- */}
              {/* The root path now correctly renders the real AdminDashboard component */}
              <Route path="/" element={<AdminDashboard />} />
              
              <Route path="/manage-ads" element={<ManageAds />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;