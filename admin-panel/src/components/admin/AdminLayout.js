// admin-panel/src/components/admin/AdminLayout.js
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Shield, FileText, Users, LogOut, PanelLeftClose, PanelRightClose, Flag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Dashboard.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
    };

    // --- THIS IS THE GUARANTEED FIX ---
    // This structure uses a fixed sidebar and a main content area with a margin,
    // perfectly matching the CSS you provided.
    return (
        <>
            <aside className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <h3 className="sidebar-logo-text">الإدارة</h3>
                    <button className="sidebar-toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {/* The data-tooltip attributes can be added back here if needed */}
                        <li><NavLink to="/" end><Shield size={20} /><span>نظرة عامة</span></NavLink></li>
                        <li><NavLink to="/manage-ads"><FileText size={20} /><span>إدارة الإعلانات</span></NavLink></li>
                        <li><NavLink to="/manage-users"><Users size={20} /><span>إدارة المستخدمين</span></NavLink></li>
                        <li><NavLink to="/manage-reports"><Flag size={20} /><span>البلاغات</span></NavLink></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className={`dashboard-content ${isCollapsed ? 'collapsed' : ''}`}>
                <Outlet />
            </main>
        </>
    );
};

export default AdminLayout;