// admin-panel/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import the provider and hook
import AdminLogin from './components/AdminLogin';
import './styles/forms.css';

const ProtectedRoute = ({ children }) => {
    const { user, token } = useAuth();
    // Now we use the real token from our context
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AdminDashboard = () => {
    const { user, logout } = useAuth(); // Get user and logout from context
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>أهلاً بك في لوحة التحكم, {user?.name}</h1>
            <button onClick={logout}>تسجيل الخروج</button>
        </div>
    );
};

function App() {
  return (
    // 1. Wrap the entire app in AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;