// admin-panel/src/components/admin/AdminAdDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carAdsData, realEstateAdsData } from './mockDataForAdmin';

const AdminAdDetailView = () => {
    const { adId } = useParams();

    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const allAds = [...carAdsData, ...realEstateAdsData];
                const foundAd = allAds.find(a => a.id == adId);
                if (!foundAd) throw new Error("Ad not found");
                setAd(foundAd);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }, [adId]);

    if (isLoading) return <p>جاري تحميل تفاصيل الإعلان...</p>;
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
                    <li><strong>صاحب الإعلان:</strong> {ad.user.name} (ID: {ad.user.id})</li>
                    <li><strong>تاريخ النشر:</strong> {ad.date}</li>
                    <li><strong>الحالة الحالية:</strong> {ad.status}</li>
                </ul>

                <h3>تفاصيل إضافية (سيارة)</h3>
                <ul>
                    <li><strong>سنة الصنع:</strong> {ad.model_year || 'N/A'}</li>
                    <li><strong>المسافة المقطوعة:</strong> {ad.distance_traveled || 'N/A'}</li>
                </ul>
                
                <div className="actions-cell" style={{ marginTop: '30px' }}>
                    <button className="action-btn approve">موافقة على الإعلان</button>
                    <button className="action-btn reject">رفض الإعلان</button>
                </div>
            </div>
        </div>
    );
};

export default AdminAdDetailView;