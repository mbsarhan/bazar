// src/frontend/components/dashboard/DashboardOverview.js
import React, { useState, useEffect, useMemo } from 'react';
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

import { ar } from 'date-fns/locale'; 
import { subDays, format } from 'date-fns';
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

    const [timeRange, setTimeRange] = useState('weeks'); // 'weeks' or 'days'

    const [viewData, setViewData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchViewData = async () => {
            setIsLoading(true);
            
            // SIMULATION: In a real app, you'd pass the timeRange to your API
            // const response = await axios.get(`/api/dashboard/views?range=${timeRange}`);
            console.log(`Fetching data for range: ${timeRange}`);

            const dataLength = timeRange === 'weeks' ? 7 : 7; // Both are 7 for now
            const fakeApiData = Array.from({ length: dataLength }, () => Math.floor(Math.random() * 200) + 50);
            
            setTimeout(() => {
                setViewData(fakeApiData);
                setIsLoading(false);
            }, 300); // Simulate network delay
        };

        fetchViewData();
    }, [timeRange]); // The dependency array now includes `timeRange`

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
        const labels = timeRange === 'weeks' ? generate7DayWeeks() : generateLast7Days();
        return {
            labels: labels,
            datasets: [ {
                label: 'المشاهدات',
                data: viewData, // Use the real data from our state
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
            } ],
        };
    }, [viewData], [timeRange]); // Dependency array: only re-run when viewData is updated

    return (
        <div>
            <div className="content-header">
                <h1>أهلاً بك، {userName}!</h1>
                <Link to="/add-ad" className="submit-btn" style={{maxWidth: '200px'}}>+ أضف إعلاناً جديداً</Link>
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
                {isLoading ? (
                    <div className="chart-skeleton-loader"></div>
                ) : (
                    <Line options={chartOptions} data={chartData} />
                )}
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