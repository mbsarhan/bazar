// src/frontend/components/dashboard/DashboardOverview.js
import React from 'react';
import { Link } from 'react-router-dom';
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
import { carAdsData, realEstateAdsData } from './mockData';

const cursorFollowPositioner = function(items) {
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

const DashboardOverview = () => {
    const { user } = useAuth();
    const userName = user ? user.fname : "المستخدم";

    // --- 1. Calculate Statistics ---
    const carStats = {
        active: carAdsData.filter(ad => ad.status === 'فعال').length,
        pending: carAdsData.filter(ad => ad.status === 'قيد المراجعة').length,
        sold: carAdsData.filter(ad => ad.status === 'مباع').length,
    };
    const realEstateStats = {
        active: realEstateAdsData.filter(ad => ad.status === 'فعال').length,
        pending: realEstateAdsData.filter(ad => ad.status === 'قيد المراجعة').length,
        sold: realEstateAdsData.filter(ad => ad.status === 'مؤجر').length,
    };

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
                text: 'مشاهدات الإعلانات خلال الأسابيع الماضية',
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

    const chartLabels = ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4', 'الأسبوع 5', 'الأسبوع 6', 'الأسبوع 7'];
    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'المشاهدات',
                data: [65, 59, 80, 81, 56, 75, 90], // New mock data
                fill: true, // This enables the gradient fill
                // This function creates the gradient
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.4)');
                    gradient.addColorStop(1, 'rgba(144, 238, 144, 0)');
                    return gradient;
                },
                borderColor: '#50C878', // A stronger green for the line
                borderWidth: 3, // Thicker line
                pointRadius: 4, // Size of the dots on the line
                pointBackgroundColor: '#50C878',
                tension: 0.4, // This makes the line curvy and smooth
            },
        ],
    };

    return (
        <div>
            <div className="content-header">
                <h1>أهلاً بك، {userName}!</h1>
                <Link to="/add-ad" className="submit-btn" style={{maxWidth: '200px'}}>+ أضف إعلاناً جديداً</Link>
            </div>

            {/* --- 3. Graph on Top --- */}
            <div className="chart-container" style={{ height: '400px', position: 'relative' }}>
                <Line options={chartOptions} data={chartData} />
            </div>
            
            {/* --- 4. Car Stat Boxes --- */}
            <h2 className="stats-header">إحصائيات السيارات</h2>
            <div className="stats-container">
                <div className="stat-card stat-card-active">
                    <h2>{carStats.active}</h2>
                    <p>إعلانات سيارات نشطة</p>
                </div>
                <div className="stat-card stat-card-pending">
                    <h2>{carStats.pending}</h2>
                    <p>إعلانات سيارات قيد المراجعة</p>
                </div>
                <div className="stat-card stat-card-sold">
                    <h2>{carStats.sold}</h2>
                    <p>إعلانات سيارات مباعة أو مؤجرة</p>
                </div>
            </div>

            {/* --- 5. Real Estate Stat Boxes --- */}
            <h2 className="stats-header">إحصائيات العقارات</h2>
            <div className="stats-container">
                 <div className="stat-card stat-card-active">
                    <h2>{realEstateStats.active}</h2>
                    <p>إعلانات عقارات نشطة</p>
                </div>
                 <div className="stat-card stat-card-pending">
                    <h2>{realEstateStats.pending}</h2>
                    <p>إعلانات عقارات قيد المراجعة</p>
                </div>
                 <div className="stat-card stat-card-sold">
                    <h2>{realEstateStats.sold}</h2>
                    <p>إعلانات عقارات مباعة أو مؤجرة</p>
                </div>
            </div>

        </div>
    );
};

export default DashboardOverview;