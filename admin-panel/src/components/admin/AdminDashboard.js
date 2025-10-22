// admin-panel/src/components/admin/AdminDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// 1. Import the necessary components from recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Clock } from 'lucide-react';
import '../../styles/AdminPages.css';


const AdminDashboard = () => {
    // --- Mock Data (to be replaced by API calls) ---
    const [stats, setStats] = useState({ totalUsers: 125, totalAds: 210, pendingAds: 3 });
    const chartData = [
        { name: 'السبت', 'عدد الإعلانات': 12 },
        { name: 'الأحد', 'عدد الإعلانات': 19 },
        { name: 'الاثنين', 'عدد الإعلانات': 8 },
        { name: 'الثلاثاء', 'عدد الإعلانات': 15 },
        { name: 'الأربعاء', 'عدد الإعلانات': 11 },
        { name: 'الخميس', 'عدد الإعلانات': 9 },
        { name: 'الجمعة', 'عدد الإعلانات': 13 },
    ];

    return (
        <div>
            <div className="content-header">
                <h1>نظرة عامة</h1>
            </div>

            {/* --- Stat Cards Section --- */}
            <div className="stats-container">
                <div className="stat-card">
                    <Users size={32} className="stat-icon" />
                    <h2>{stats.totalUsers}</h2>
                    <p>إجمالي المستخدمين</p>
                </div>
                <div className="stat-card">
                    <FileText size={32} className="stat-icon" />
                    <h2>{stats.totalAds}</h2>
                    <p>إجمالي الإعلانات</p>
                </div>
                <Link to="/manage-ads" className="stat-card pending-card">
                    <Clock size={32} className="stat-icon" />
                    <h2>{stats.pendingAds}</h2>
                    <p>إعلانات قيد المراجعة</p>
                </Link>
            </div>
            
            {/* --- Chart and Recent Activity Section --- */}
            <div className="chart-container">
                <h3 className="chart-title">الإعلانات الجديدة في آخر 7 أيام</h3>
                {/* 2. The new Recharts component */}
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontFamily: 'Cairo', fontSize: 12 }} />
                        <YAxis tick={{ fontFamily: 'Cairo', fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(144, 238, 144, 0.1)' }}
                            contentStyle={{ 
                                backgroundColor: '#33363b', 
                                border: 'none',
                                borderRadius: '8px',
                                fontFamily: 'Cairo' 
                            }}
                            labelStyle={{ color: 'white' }}
                        />
                        <Bar dataKey="عدد الإعلانات" fill="#90EE90" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;