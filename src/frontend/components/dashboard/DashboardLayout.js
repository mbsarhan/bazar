// src/frontend/components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Car, Home, Star, LogOut, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import Tippy from '@tippyjs/react'; // 1. Import Tippy
import 'tippy.js/dist/tippy.css'; // 2. Import the default tooltip styles
import '../../styles/Dashboard.css';

const TooltipWrapper = ({ content, children }) => {
    const { isDashboardCollapsed } = useAuth();
    return (
        <Tippy 
            content={content} 
            placement="left" 
            disabled={!isDashboardCollapsed}
            theme="bazaar" // <-- ADD THIS LINE
        >
            {children}
        </Tippy>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    // --- CHANGE 1: Get the 'logout' function from the context ---
    const { isDashboardCollapsed, setIsDashboardCollapsed, logout } = useAuth();

    // --- CHANGE 2: Make this function 'async' and call the context's logout ---
    const handleLogoutConfirm = async () => {
        try {
            await logout(); // This now calls our API and clears local storage
            setIsLogoutModalOpen(false); // Close the modal
            navigate('/login'); // Redirect the user to the login page
        } catch (error) {
            console.error("Logout failed:", error);
            // Optionally, show an error message to the user
        }
    };

    // The outer div is no longer needed, we return the elements directly
    return (
        <div>
            <aside className={`dashboard-sidebar ${isDashboardCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div></div>
                    <button className="sidebar-toggle-btn" onClick={() => setIsDashboardCollapsed(!isDashboardCollapsed)}>
                        {isDashboardCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {/* 4. Wrap each link in the TooltipWrapper */}
                        <li>
                            <TooltipWrapper content="نظرة عامة">
                                <NavLink to="/dashboard" end>
                                    <LayoutDashboard size={20} />
                                    <span>نظرة عامة</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="معلوماتي الشخصية">
                                <NavLink to="/dashboard/my-profile">
                                    <User size={20} />
                                    <span>معلوماتي الشخصية</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="إعلاناتي للسيارات">
                                <NavLink to="/dashboard/car-ads">
                                    <Car size={20} />
                                    <span>إعلاناتي للسيارات</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="إعلاناتي للعقارات">
                                <NavLink to="/dashboard/real-estate-ads">
                                    <Home size={20} />
                                    <span>إعلاناتي للعقارات</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="تقييماتي">
                                <NavLink to="/dashboard/reviews">
                                    <Star size={20} />
                                    <span>تقييماتي</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <TooltipWrapper content="تسجيل الخروج">
                        <button onClick={() => setIsLogoutModalOpen(true)} className="logout-btn">
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </button>
                    </TooltipWrapper>
                </div>
            </aside>

            {/* The main content area also gets the collapsed class to adjust its margin */}
            <main className={`dashboard-content ${isDashboardCollapsed ? 'collapsed' : ''}`}>
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