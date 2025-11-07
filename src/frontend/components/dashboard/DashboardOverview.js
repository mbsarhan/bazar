// src/frontend/components/dashboard/DashboardOverview.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Plus } from 'lucide-react'; // Import the Plus icon
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';

import { ar } from 'date-fns/locale';
import { subDays, format } from 'date-fns';

const cursorFollowPositioner = function (items) {
    const event = arguments[arguments.length - 1];

    if (!items.length || !event) {
        return false;
    }

    return {
        x: items[0].element.x,
        y: event.y
    };
};

Tooltip.positioners.cursorFollow = cursorFollowPositioner;

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const generate7DayWeeks = () => {
    const labels = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const endDate = subDays(today, i * 7);
        const startDate = subDays(endDate, 6);

        const startFormatted = format(startDate, 'd MMMM', { locale: ar });
        const endFormatted = format(endDate, 'd MMMM', { locale: ar });

        const labelArray = [startFormatted, '-', endFormatted];

        labels.push(labelArray);
    }
    return labels;
};

const generateLast7Days = () => {
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const formattedDate = format(date, 'd MMMM', { locale: ar });
        labels.push(formattedDate);
    }
    return labels;
};


const DashboardOverview = () => {
    const { user } = useAuth();
    const userName = user ? user.fname : "المستخدم";
    const navigate = useNavigate();

    const handleAddAdClick = () => {
        navigate('/add-ad-choice');
    };

    const { getDashboardStats, getDashboardViews } = useDashboard();

    const [stats, setStats] = useState({
        carStats: { active: 0, pending: 0, sold: 0 },
        realEstateStats: { active: 0, pending: 0, sold: 0 },
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const [timeRange, setTimeRange] = useState('weeks');

    const [viewData, setViewData] = useState([]);
    const [viewsLoading, setViewsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, [getDashboardStats]);

    useEffect(() => {
        const fetchViewData = async () => {
            setViewsLoading(true);
            try {
                const data = await getDashboardViews(timeRange);
                setViewData(data);
            } catch (error) {
                console.error(`Failed to fetch view data for range: ${timeRange}`, error);
            } finally {
                setViewsLoading(false);
            }
        };

        fetchViewData();
    }, [timeRange, getDashboardViews]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'مشاهدات الإعلانات',
                font: { family: 'Cairo', size: 18, weight: '600' },
                color: '#33363b',
                align: 'start',
                padding: { top: 0, bottom: 20 }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#33363b',
                titleFont: { family: 'Cairo', size: 14, weight: 'bold' },
                bodyFont: { family: 'Cairo', size: 12 },
                cornerRadius: 8,
                padding: 12,
                caretPadding: 20,
                caretSize: 0,
                displayColors: true,
                position: 'cursorFollow',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { family: 'Cairo', size: 12 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    borderDash: [5, 5],
                    color: '#e0e0e0',
                },
                ticks: {
                    font: { family: 'Cairo', size: 12 },
                },
            },
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    const chartData = useMemo(() => {
        const labels = timeRange === 'weeks' ? generate7DayWeeks() : generateLast7Days();

        return {
            labels: labels,
            datasets: [{
                label: 'المشاهدات',
                data: viewData,
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.4)');
                    gradient.addColorStop(1, 'rgba(144, 238, 144, 0)');
                    return gradient;
                },
                borderColor: '#50C878',
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#50C878',
                tension: 0.4,
            }],
        };
    }, [viewData, timeRange]);

    return (
        <div>
            <div className="content-header">
                <h1>أهلاً بك، {userName}!</h1>
                <button
                    onClick={handleAddAdClick}
                    className="dashboard-add-ad-btn"
                >
                    <Plus size={18} />
                    <span>أضف إعلاناً جديداً</span>
                </button>
            </div>

            <div className="stats-header with-toggle">
                <h2>نظرة عامة على المشاهدات</h2>
                <div className="view-changer">
                    <button
                        className={timeRange === 'weeks' ? 'active' : ''}
                        onClick={() => setTimeRange('weeks')}
                    >
                        آخر 7 أسابيع
                    </button>
                    <button
                        className={timeRange === 'days' ? 'active' : ''}
                        onClick={() => setTimeRange('days')}
                    >
                        آخر 7 أيام
                    </button>
                </div>
            </div>

            <div className="chart-container" style={{ height: '400px', position: 'relative' }}>
                {viewsLoading ? (
                    <div className="chart-skeleton-loader"></div>
                ) : (
                    <Line options={chartOptions} data={chartData} />
                )}
            </div>

            <h2 className="stats-header">إحصائيات السيارات</h2>
            <div className="stats-container">
                <div className="stat-card stat-card-active">
                    <h2>{statsLoading ? '...' : stats.carStats.active}</h2>
                    <p>إعلانات سيارات نشطة</p>
                </div>
                <div className="stat-card stat-card-pending">
                    <h2>{statsLoading ? '...' : stats.carStats.pending}</h2>
                    <p>إعلانات سيارات قيد المراجعة</p>
                </div>
                <div className="stat-card stat-card-sold">
                    <h2>{statsLoading ? '...' : stats.carStats.sold}</h2>
                    <p>إعلانات سيارات مباعة أو مؤجرة</p>
                </div>
            </div>

            <h2 className="stats-header">إحصائيات العقارات</h2>
            <div className="stats-container">
                <div className="stat-card stat-card-active">
                    <h2>{statsLoading ? '...' : stats.realEstateStats.active}</h2>
                    <p>إعلانات عقارات نشطة</p>
                </div>
                <div className="stat-card stat-card-pending">
                    <h2>{statsLoading ? '...' : stats.realEstateStats.pending}</h2>
                    <p>إعلانات عقارات قيد المراجعة</p>
                </div>
                <div className="stat-card stat-card-sold">
                    <h2>{statsLoading ? '...' : stats.realEstateStats.sold}</h2>
                    <p>إعلانات عقارات مباعة أو مؤجرة</p>
                </div>
            </div>

        </div>
    );
};

export default DashboardOverview;