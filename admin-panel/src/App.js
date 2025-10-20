// admin-panel/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ManageAds from './components/admin/ManageAds';
import AdminAdDetailView from './components/admin/AdminAdDetailView';
import './styles/forms.css';

// --- A simple, consistent Header for the Admin Panel ---
const AdminHeader = () => {
    const { logout } = useAuth();
    return (
        <header className="main-header">
            <div className="header-content">
                <div className="logo">لوحة تحكم بازار</div>
                <div className="header-actions">
                    <button onClick={logout} className="logout-btn-header">تسجيل الخروج</button>
                </div>
            </div>
        </header>
    );
};


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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            {/* --- THIS IS THE FIX --- */}
            {/* The Header is now part of the protected layout */}
            <Route 
                element={
                    <>
                        <AdminHeader />
                        <Outlet />
                    </>
                }
            >
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<h1>نظرة عامة</h1>} />
                    <Route path="/manage-ads" element={<ManageAds />} />
                    <Route path="/admin/view-ad/:adId" element={<AdminAdDetailView />} />
                    <Route path="/manage-users" element={<h1>إدارة المستخدمين</h1>} />
                </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;