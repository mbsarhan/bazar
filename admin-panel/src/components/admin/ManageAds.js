// admin-panel/src/components/admin/ManageAds.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { carAdsData, realEstateAdsData } from './mockDataForAdmin';
import '../../styles/AdminPages.css';
import { useAdmin } from '../../context/AdminContext'; // 1. IMPORT


const ManageAds = () => {
    const [statusFilter, setStatusFilter] = useState('pending');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const navigate = useNavigate();

    const { 
        getPendingUpdates, 
        approveUpdate, 
        rejectUpdate 
    } = useAdmin(); // 2. GET FUNCTIONS
    const [pendingAds, setPendingAds] = useState([]);
    useEffect(() => {
        const fetchPending = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPendingUpdates();
                setPendingAds(data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch pending ads.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPending();
    }, [getPendingUpdates]);

    const handleActionClick = (e) => {
        // Prevent the row's click event from firing when a button is clicked
        e.stopPropagation();
    };

    // No more isLoading or error state needed for this prototype
    
    // 4. CONNECT a handler to the real API call
    const handleApprove = async (adId) => {
        try {
            await approveUpdate(adId);
            // On success, filter the ad from the local state for instant UI update
            setPendingAds(prev => prev.filter(ad => ad.id !== adId));
        } catch (err) {
            alert("Failed to approve the ad."); // Simple error handling
        }
    };

    const handleReject = async (adId) => {
        try {
            await rejectUpdate(adId);
            setPendingAds(prev => prev.filter(ad => ad.id !== adId));
        } catch (err) {
            alert("Failed to reject the ad.");
        }
    };

    if (isLoading) return <p>جاري تحميل الإعلانات...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const dynamicTitle = statusFilter === 'pending' 
        ? 'الإعلانات قيد المراجعة' 
        : 'الإعلانات الفعالة';

    return (
        <div>
            <div className="content-header">
                <h1>{dynamicTitle}</h1>
                {/* --- 3. NEW: The Dropdown Filter --- */}
                <div className="sort-dropdown-wrapper">
                    <select 
                        className="sort-dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="pending">قيد المراجعة</option>
                        <option value="active">الفعالة</option>
                    </select>
                </div>
            </div>

            <div className="admin-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>العنوان</th>
                            <th>صاحب الإعلان</th>
                            <th>النوع</th>
                            <th>تاريخ النشر</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingAds.length > 0 ? (
                            pendingAds.map(ad => (
                                // 3. Add onClick to the table row
                                <tr key={ad.id} className="clickable-row" onClick={() => navigate(`/admin/view-ad/${ad.id}`)}>
                                    <td>{ad.title}</td>
                                    <td>{ad.user.name}</td>
                                    <td>{ad.type}</td>
                                    <td>{ad.date}</td>
                                    <td className="actions-cell" onClick={handleActionClick}>
                                        <button className="action-btn approve" onClick={() => handleApprove(ad.id)}>
                                            موافقة
                                        </button>
                                        <button className="action-btn reject" onClick={() => handleReject(ad.id)}>
                                            رفض
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>لا يوجد إعلانات جديدة للمراجعة.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageAds;