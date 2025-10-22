// admin-panel/src/components/admin/AdminAdDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link ,useNavigate } from 'react-router-dom';
import { carAdsData, realEstateAdsData } from './mockDataForAdmin';
import { useAdmin } from '../../context/AdminContext'; // Use the admin context

const AdminAdDetailView = () => {
    const { adId } = useParams();
    const navigate = useNavigate();
    const { getPendingUpdateById, approveUpdate, rejectUpdate } = useAdmin();



    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the detailed pending update data
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPendingUpdateById(adId);
                setAd(data);
            } catch (err) {
                setError("Failed to fetch ad details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [adId, getPendingUpdateById]);


    const handleApprove = async () => {
        try {
            await approveUpdate(adId);
            alert("Update Approved!");
            navigate('/manage-ads');
        } catch (err) {
            alert("Failed to approve update.");
        }
    };


    const handleReject = async () => {
        try {
            await rejectUpdate(adId);
            alert("Update Rejected!");
            navigate('/manage-ads');
        } catch (err) {
            alert("Failed to reject update.");
        }
    };

    if (isLoading) return <p>جاري تحميل تفاصيل الإعلان...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!ad) return <p>لم يتم العثور على الإعلان.</p>;

    return (
        <div>
            <div className="content-header">
                <h1>تفاصيل الإعلان: {ad.title}</h1>
                {/* --- THIS IS THE FIX --- */}
                {/* Changed className from "submit-btn" to a new, specific class */}
                <Link to="/manage-ads" className="back-link-btn">العودة إلى القائمة</Link>
            </div>

            <div className="admin-detail-view">
                <h3>المعلومات الأساسية</h3>
                <ul>
                    <li><strong>المعرف:</strong> {ad.id}</li>
                    <li><strong>العنوان:</strong> {ad.title}</li>
                    <li><strong>السعر:</strong> {ad.price}</li>
                    <li><strong>صاحب الإعلان:</strong> {ad.owner.name} (ID: {ad.owner.id})</li>
                    <li><strong>تاريخ النشر:</strong> {ad.created_at}</li>
                    <li><strong>الحالة الحالية:</strong> {ad.status}</li>
                </ul>

                <h3>تفاصيل إضافية (سيارة)</h3>
                <ul>
                    <li><strong>سنة الصنع:</strong> {ad.model_year || 'N/A'}</li>
                    <li><strong>المسافة المقطوعة:</strong> {ad.distance_traveled || 'N/A'}</li>
                </ul>
                
                <div className="actions-cell" style={{ marginTop: '30px' }}>
                    <button className="action-btn approve" onClick={handleApprove}>موافقة على الإعلان</button>
                    <button className="action-btn reject" onClick={handleReject}>رفض الإعلان</button>
                </div>
            </div>
        </div>
    );
};

export default AdminAdDetailView;