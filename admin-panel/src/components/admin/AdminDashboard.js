// admin-panel/src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Clock } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/AdminPages.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalAds: 0, pendingAds: 0 });
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the stable functions from the context
    const { getDashboardStats, getWeeklyChartData } = useAdmin();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // The isLoading state is now managed by the context,
                // but we can keep this pattern for clarity.
                const [statsData, weeklyData] = await Promise.all([
                    getDashboardStats(),
                    getWeeklyChartData()
                ]);

                if (statsData) setStats(statsData);
                if (weeklyData) setChartData(weeklyData);

            } catch (err) {
                // Error is handled by the context, so we don't need to do much here
                console.error("Dashboard component failed to fetch data.");
            } finally {
                // 3. Set loading state to false directly here
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [getDashboardStats, getWeeklyChartData]);

    // --- 1. RENDER STATES ---

    if (error) {
        return <div className="error-message" style={{ margin: '20px' }}>حدث خطأ: {error}</div>;
    }

    // --- 2. THE SKELETON UI ---
    // If the context says it's loading, we show the skeleton.
    if (isLoading) {
        return (
            <div>
                <div className="content-header">
                    <h1>نظرة عامة</h1>
                </div>
                {/* Stat Card Skeletons */}
                <div className="stats-container">
                    <div className="stat-card-skeleton skeleton"></div>
                    <div className="stat-card-skeleton skeleton"></div>
                    <div className="stat-card-skeleton skeleton"></div>
                </div>
                {/* Chart Skeleton */}
                <div className="chart-skeleton-loader skeleton"></div>
            </div>
        );
    }

    // --- 3. THE FINAL UI (when loading is false and there are no errors) ---
    return (
        <div>
            <div className="content-header">
                <h1>نظرة عامة</h1>
            </div>

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

            <div className="chart-container">
                <h3 className="chart-title">الإعلانات الجديدة في آخر 7 أيام</h3>
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
                            contentStyle={{ backgroundColor: '#33363b', border: 'none', borderRadius: '8px', fontFamily: 'Cairo' }}
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