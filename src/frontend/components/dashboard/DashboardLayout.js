// src/frontend/components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Car, Home, Star, LogOut, PanelLeftClose, PanelRightClose } from 'lucide-react';
import Modal from './Modal';
import '../../styles/Dashboard.css';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { isDashboardCollapsed, setIsDashboardCollapsed } = useAuth();

    const handleLogoutConfirm = () => {
        alert('تم تسجيل الخروج بنجاح!');
        setIsLogoutModalOpen(false);
        navigate('/login');
    };

    return (
        // Apply a class to the container when collapsed
        <div className={`dashboard-container ${isDashboardCollapsed ? 'collapsed' : ''}`}>
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    {/* The text will be hidden with CSS when collapsed */}
                    <h3 className="sidebar-logo-text">بازار</h3>
                    <button className="sidebar-toggle-btn" onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)}>
                        {isDashboardCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {/* Each link now has an icon and a span for the text */}
                        <li>
                            <NavLink to="/dashboard" end>
                                <LayoutDashboard size={20} />
                                <span>نظرة عامة</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/my-profile">
                                <User size={20} />
                                <span>معلوماتي الشخصية</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/car-ads">
                                <Car size={20} />
                                <span>إعلاناتي للسيارات</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/real-estate-ads">
                                <Home size={20} />
                                <span>إعلاناتي للعقارات</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/reviews">
                                <Star size={20} />
                                <span>تقييماتي</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => setIsLogoutModalOpen(true)} className="logout-btn">
                        <LogOut size={20} />
                        <span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                <Outlet />
            </main>

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="تأكيد تسجيل الخروج"
            >
                <p>هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
            </Modal>
        </div>
    );
};

export default DashboardLayout;