// src/components/dashboard/DashboardLayout.js
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css'; 
import Modal from './Modal';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogoutConfirm = () => {
        // منطق تسجيل الخروج الحقيقي سيتم إضافته لاحقاً
        alert('تم تسجيل الخروج بنجاح!');
        setIsLogoutModalOpen(false); // إغلاق المودال
        navigate('/login');
    };

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h3>لوحة التحكم</h3>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        {/* 
                            نستخدم NavLink بدلاً من Link لأنه يضيف كلاس "active" تلقائياً
                            للرابط الذي يتوافق مع المسار الحالي، مما يسهل تمييزه.
                            prop "end" مهم للصفحة الرئيسية لمنعها من أن تكون نشطة دائماً.
                        */}
                        <li><NavLink to="/dashboard" end>نظرة عامة</NavLink></li>
                        <li><NavLink to="/dashboard/my-profile">معلوماتي الشخصية</NavLink></li>
                        <li><NavLink to="/dashboard/car-ads">إعلاناتي للسيارات</NavLink></li>
                        <li><NavLink to="/dashboard/real-estate-ads">إعلاناتي للعقارات</NavLink></li>
                        <li><NavLink to="/dashboard/reviews">تقييماتي</NavLink></li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogoutClick} className="logout-btn">تسجيل الخروج</button>
                </div>
            </aside>

            <main className="dashboard-content">
                {/* 
                    <Outlet> هو المكان الذي ستقوم react-router بعرض المكونات
                    الفرعية فيه (مثل صفحة نظرة عامة، معلوماتي، إلخ).
                */}
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