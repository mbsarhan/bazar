// admin-panel/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// 1. Import the necessary components from recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Clock } from 'lucide-react';
import '../../styles/AdminPages.css';
import { useAdmin } from '../../context/AdminContext';


const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalAds: 0, pendingAds: 0 });
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);
    const { getDashboardStats, isLoading, error } = useAdmin(); // <-- 2. GET THE FUNCTION FROM THE CONTEXT
    const chartData = [
        { name: 'السبت', 'عدد الإعلانات': 12 },
        { name: 'الأحد', 'عدد الإعلانات': 19 },
        { name: 'الاثنين', 'عدد الإعلانات': 8 },
        { name: 'الثلاثاء', 'عدد الإعلانات': 15 },
        { name: 'الأربعاء', 'عدد الإعلانات': 11 },
        { name: 'الخميس', 'عدد الإعلانات': 9 },
        { name: 'الجمعة', 'عدد الإعلانات': 13 },
    ];

    // --- 3. FETCH DATA WHEN THE COMPONENT MOUNTS ---
    useEffect(() => {
        const fetchStats = async () => {
            // The context will automatically handle setting loading and error states.
            // We just need to get the data and update our local 'stats' state.
            try {
                const data = await getDashboardStats();
                if (data) { // Check if data is not null/undefined
                    setStats(data);
                }
            } catch (err) {
                // The context already logged the error, but we can have a fallback.
                console.error("Dashboard component failed to get stats.");
            }
        };

        fetchStats();
    }, [getDashboardStats]); // Dependency array ensures it runs once

    if (error) {
        return <div className="error-message" style={{ margin: '20px' }}>حدث خطأ: {error}</div>;
    }

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