// admin-panel/src/components/admin/ManageAds.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { carAdsData, realEstateAdsData } from './mockDataForAdmin';
import '../../styles/AdminPages.css';

const ManageAds = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const navigate = useNavigate();
    const [pendingAds, setPendingAds] = useState([]);
    useEffect(() => {
        // ... (data fetching simulation is the same)
        const allPending = [...carAdsData, ...realEstateAdsData];
        setPendingAds(allPending);
        setIsLoading(false);
    }, []);

    const handleActionClick = (e) => {
        // Prevent the row's click event from firing when a button is clicked
        e.stopPropagation();
    };

    // No more isLoading or error state needed for this prototype
    
    // --- Button handlers now only modify local state ---
    const handleApprove = (adId) => {
        console.log(`Approving ad ${adId}`);
        setPendingAds(prev => prev.filter(ad => ad.id !== adId));
    };

    const handleReject = (adId) => {
        console.log(`Rejecting ad ${adId}`);
        setPendingAds(prev => prev.filter(ad => ad.id !== adId));
    };

    if (isLoading) return <p>جاري تحميل الإعلانات...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <div className="content-header">
                <h1>الإعلانات قيد المراجعة</h1>
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