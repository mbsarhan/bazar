import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import ManageAds from './components/admin/ManageAds';
import AdminAdDetailView from './components/admin/AdminAdDetailView';
import ManageUsers from './components/admin/ManageUsers';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageReports from './components/admin/ManageReports';
import './styles/forms.css';

// --- Your AdminHeader component is perfect as is ---
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


// --- The ProtectedRoute, corrected to use 'user' from your AuthContext ---
const ProtectedRoute = () => {
    // 1. Get 'user' and 'isLoading' from the context
    const { user, isLoading } = useAuth();

    if (isLoading) {
        // You can return a full-page loader here for a better UX
        return <div className="full-page-loader">Loading Session...</div>;
    }
    
    // 2. The logic is now: if a 'user' object exists (meaning they are an authenticated admin), allow access.
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// --- The PublicRoute, corrected to use 'user' ---
const PublicRoute = () => {
    // 1. Get 'user' and 'isLoading'
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="full-page-loader">Loading...</div>;
    }
    
    // 2. If a 'user' exists, redirect from the login page to the main dashboard.
    return user ? <Navigate to="/" replace /> : <Outlet />;
};

// --- The Main App Component ---
function App() {
  return (
    // 1. The Providers should wrap the Router
    <AuthProvider>
      <AdminProvider>
        <Router>
          {/* Your routing structure is excellent, we just adapt it slightly */}
          <Routes>
            {/* --- Public Routes (like the login page) --- */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<AdminLogin />} />
            </Route>

            {/* --- Protected Routes (the main admin panel) --- */}
            <Route element={<ProtectedRoute />}>
              {/* This wrapper ensures the header is on every protected page */}
              <Route 
                  element={
                      <>
                          <AdminHeader />
                          <Outlet />
                      </>
                  }
              >
                {/* The AdminLayout provides the sidebar */}
                <Route element={<AdminLayout />}>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/manage-ads" element={<ManageAds />} />
                    <Route path="/manage-users" element={<ManageUsers />} />
                    <Route path="/manage-reports" element={<ManageReports />} />
                </Route>
                <Route path="/admin/view-ad/:adId" element={<AdminAdDetailView />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

// Wrap the entire app in the main App component in index.js
// This makes the structure cleaner.
const Root = () => (
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

export default Root; // In index.js, you would just render <Root />