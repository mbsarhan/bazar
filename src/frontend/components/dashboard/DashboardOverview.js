// src/frontend/components/dashboard/DashboardOverview.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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
import { useDashboard } from '../../context/DashboardContext'; // <-- 1. IMPORT

import { ar } from 'date-fns/locale';
import { subDays, format } from 'date-fns';

const cursorFollowPositioner = function (items) {
    // The event is the last argument
    const event = arguments[arguments.length - 1];

    // If there's no event, we can't position, so return false
    if (!items.length || !event) {
        return false;
    }

    // Return the x from the first item and the y from the mouse event
    return {
        x: items[0].element.x,
        y: event.y
    };
};

// 2. Register our new positioner with Chart.js
Tooltip.positioners.cursorFollow = cursorFollowPositioner;

// This is a required step for Chart.js v3+
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

        let labelArray;

        // --- THE GUARANTEED FIX for ALL labels ---

        // ALWAYS format the start and end dates completely and separately
        const startFormatted = format(startDate, 'd MMMM', { locale: ar }); // e.g., "٣١ أغسطس"
        const endFormatted = format(endDate, 'd MMMM', { locale: ar });   // e.g., "٦ سبتمبر"

        // ALWAYS use the pre-reversed, multi-line array format.
        // This is guaranteed to bypass the browser's rendering bug.
        labelArray = [startFormatted, '-', endFormatted];

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
        navigate('/', { state: { fromDashboard: true } });
    };

    const { getDashboardStats, getDashboardViews } = useDashboard(); // <-- 2. GET THE FUNCTION

    // --- 3. CREATE STATE for the statistics data ---
    const [stats, setStats] = useState({
        carStats: { active: 0, pending: 0, sold: 0 },
        realEstateStats: { active: 0, pending: 0, sold: 0 },
    });
    const [statsLoading, setStatsLoading] = useState(true);

    const [timeRange, setTimeRange] = useState('weeks'); // 'weeks' or 'days'

    const [viewData, setViewData] = useState([]);
    const [viewsLoading, setViewsLoading] = useState(true); // Renamed from isLoading




    // --- 4. CREATE A SEPARATE useEffect for fetching statistics ---
    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                // Optionally set an error state here to show a message
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
                // Call the API with the current timeRange
                const data = await getDashboardViews(timeRange);
                setViewData(data);
            } catch (error) {
                console.error(`Failed to fetch view data for range: ${timeRange}`, error);
            } finally {
                setViewsLoading(false);
            }
        };

        fetchViewData();
    }, [timeRange, getDashboardViews]); // The dependency array now includes `timeRange`

    // --- 2. Prepare Chart Data (Mock Data for Views) ---
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allows us to control height
        plugins: {
            legend: {
                display: false, // Hide the legend box
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
                    display: false, // Hide vertical grid lines
                },
                ticks: {
                    font: { family: 'Cairo', size: 12 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    borderDash: [5, 5], // Make horizontal grid lines dashed
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
        // This calculation depends on the 'timeRange' state
        const labels = timeRange === 'weeks' ? generate7DayWeeks() : generateLast7Days();

        return {
            labels: labels,
            datasets: [{
                label: 'المشاهدات',
                // This part of the calculation depends on the 'viewData' state
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
        // The dependency array now correctly includes BOTH 'viewData' and 'timeRange'
    }, [viewData, timeRange]);

    return (
        <div>
            <div className="content-header">
                <h1>أهلاً بك، {userName}!</h1>
                <button
                    onClick={handleAddAdClick}
                    className="submit-btn"
                    style={{ maxWidth: '200px' }}
                >
                    + أضف إعلاناً جديداً
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

            {/* --- 3. Graph on Top --- */}
            <div className="chart-container" style={{ height: '400px', position: 'relative' }}>
                {viewsLoading ? (
                    <div className="chart-skeleton-loader"></div>
                ) : (
                    <Line options={chartOptions} data={chartData} />
                )}
            </div>

            {/* --- 4. Car Stat Boxes --- */}
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

            {/* --- 5. Real Estate Stat Boxes --- */}
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