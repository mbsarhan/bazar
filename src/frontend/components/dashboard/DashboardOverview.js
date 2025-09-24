// src/components/dashboard/DashboardOverview.js
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
    const userName = "اسم المستخدم"; // سيتم جلب هذا لاحقاً

    return (
        <div>
            <div className="content-header">
                <h1>أهلاً بك مرة أخرى، {userName}!</h1>
                <Link to="/add-ad" className="submit-btn" style={{maxWidth: '200px'}}>+ أضف إعلاناً جديداً</Link>
            </div>
            <div className="stats-container">
                <div className="stat-card">
                    <h2>5</h2>
                    <p>إعلانات سيارات نشطة</p>
                </div>
                 <div className="stat-card">
                    <h2>2</h2>
                    <p>إعلانات عقارات نشطة</p>
                </div>
                 <div className="stat-card">
                    <h2>12</h2>
                    <p>إجمالي المشاهدات</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;