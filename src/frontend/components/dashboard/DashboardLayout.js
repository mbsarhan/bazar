// src/frontend/components/dashboard/DashboardLayout.js
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, Car, Home, Star, LogOut, PanelLeftClose, PanelRightClose, Menu, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Modal from './Modal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../../styles/Dashboard.css';

const TooltipWrapper = ({ content, children }) => {
    const { isDashboardCollapsed } = useAuth();
    return (
        <Tippy 
            content={content} 
            placement="left" 
            disabled={!isDashboardCollapsed}
            theme="bazaar"
        >
            {children}
        </Tippy>
    );
};

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isDashboardCollapsed, setIsDashboardCollapsed, logout } = useAuth();

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    // Close mobile menu when clicking on a nav link
    const handleNavLinkClick = () => {
        if (window.innerWidth <= 768) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            setIsLogoutModalOpen(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div>
            {/* Mobile menu button - STYLES REMOVED FROM HERE */}
            <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu size={24} />
            </button>

            {/* Mobile overlay */}
            <div 
                className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className={`dashboard-sidebar ${isDashboardCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div></div>
                    <button 
                        className="sidebar-toggle-btn" 
                        onClick={() => {
                            if (window.innerWidth <= 768) return; // disable collapse on mobile
                            setIsDashboardCollapsed(!isDashboardCollapsed)}
                        }
                    >
                        {isDashboardCollapsed ? <PanelRightClose /> : <PanelLeftClose />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <TooltipWrapper content="نظرة عامة">
                                <NavLink to="/dashboard" end onClick={handleNavLinkClick}>
                                    <LayoutDashboard size={20} />
                                    <span>نظرة عامة</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="معلوماتي الشخصية">
                                <NavLink to="/dashboard/my-profile" onClick={handleNavLinkClick}>
                                    <User size={20} />
                                    <span>معلوماتي الشخصية</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="إعلاناتي للسيارات">
                                <NavLink to="/dashboard/car-ads" onClick={handleNavLinkClick}>
                                    <Car size={20} />
                                    <span>إعلاناتي للسيارات</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="إعلاناتي للعقارات">
                                <NavLink to="/dashboard/real-estate-ads" onClick={handleNavLinkClick}>
                                    <Home size={20} />
                                    <span>إعلاناتي للعقارات</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="تقييماتي">
                                <NavLink to="/dashboard/reviews" onClick={handleNavLinkClick}>
                                    <Star size={20} />
                                    <span>تقييماتي</span>
                                </NavLink>
                            </TooltipWrapper>
                        </li>
                        <li>
                            <TooltipWrapper content="المفضلة">
                                <NavLink to="/dashboard/favorites" onClick={handleNavLinkClick}>
                                    <Heart size={20} />
                                    <span>المفضلة</span>
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
            
            {/* JSX style block is no longer needed */}
        </div>
    );
};

export default DashboardLayout;