// admin-panel/src/components/admin/ManageAds.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../styles/AdminPages.css';
import { useAdmin } from '../../context/AdminContext'; // 1. IMPORT
import { Trash2 } from 'lucide-react';


const ManageAds = () => {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [ads, setAds] = useState([]); // This state will hold either pending or active ads

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null); // Use null for initial error state
    const navigate = useNavigate();

    const { 
        getPendingUpdates, 
        approveUpdate, 
        getActiveAds, // <-- 1. GET THE NEW FUNCTION
        rejectUpdate,
        deleteActiveAd,
    } = useAdmin(); // 2. GET FUNCTIONS

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data;
                if (statusFilter === 'pending') {
                    // Fetch pending updates (which are a type of ad)
                    data = await getPendingUpdates();
                } else {
                    // Fetch active ads
                    data = await getActiveAds();
                }
                setAds(data);
            } catch (err) {
                setError(err.response?.data?.message || `Failed to fetch ${statusFilter} ads.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAds();
    }, [statusFilter, getPendingUpdates, getActiveAds]); // Re-run when filter changes

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
            setAds(prev => prev.filter(ad => ad.id !== adId));
        } catch (err) {
            alert("Failed to approve the ad."); // Simple error handling
        }
    };

    const handleReject = async (adId) => {
        try {
            await rejectUpdate(adId);
            setAds(prev => prev.filter(ad => ad.id !== adId));
        } catch (err) {
            alert("Failed to reject the ad.");
        }
    };

    // --- 2. UPDATE THE handleDelete FUNCTION ---
    const handleDelete = async (adId) => {
        if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الإعلان نهائياً؟ سيتم حذف جميع ملفاته وبياناته.')) {
            try {
                await deleteActiveAd(adId);
                // On success, filter the ad from the local state for an instant UI update
                setAds(prev => prev.filter(ad => ad.id !== adId));
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete the ad.');
            }
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
                        {ads.length > 0 ? (
                            ads.map(ad => (
                                // 3. Add onClick to the table row
                                <tr key={ad.id} className="clickable-row" onClick={() => navigate(`/admin/view-ad/${ad.id}`, { 
                                        // Pass the filter type in the state
                                        state: { type: statusFilter } 
                                    })}>
                                    <td>{ad.title}</td>
                                    <td>{ad.user.name}</td>
                                    <td>{ad.type}</td>
                                    <td>{ad.date}</td>
                                    <td className="actions-cell" onClick={handleActionClick}>
                                        {statusFilter === 'pending' ? (
                                            <>
                                                <button className="action-btn approve" onClick={() => handleApprove(ad.id)}>موافقة</button>
                                                <button className="action-btn reject" onClick={() => handleReject(ad.id)}>رفض</button>
                                            </>
                                        ) : (
                                            <button className="action-btn reject" onClick={() => handleDelete(ad.id)} title="حذف الإعلان نهائياً">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
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