// src/components/dashboard/AdCard.js
import React from 'react';

// أيقونات SVG بسيطة للأزرار
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const ViewIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

const AdCard = ({ ad, isPublic = false }) => {

    const getStatusClass = (status) => {
        if (status === 'فعال') return 'status-active';
        if (status === 'قيد المراجعة') return 'status-pending';
        if (status === 'مباع' || status === 'مؤجر') return 'status-sold';
        return '';
    };

    return (
        <div className="ad-card">
            <div className="ad-card-image">
                <img src={ad.imageUrl} alt={ad.title} />
                {/* نعرض شارة الحالة فقط إذا لم تكن البطاقة للعرض العام */}
                {!isPublic && (
                    <span className={`ad-card-status ${getStatusClass(ad.status)}`}>
                        {ad.status}
                    </span>
                )}
            </div>
            <div className="ad-card-details">
                <h3>{ad.title}</h3>
                <p className="ad-card-price">{ad.price}</p>
                <p className="ad-card-location">{ad.location}</p>
            </div>
            {!isPublic && (
                <div className="ad-card-actions">
                    <button className="action-btn view-btn"><ViewIcon /> عرض</button>
                    <button className="action-btn edit-btn"><EditIcon /> تعديل</button>
                    <button className="action-btn delete-btn"><DeleteIcon /> حذف</button>
                </div>
            )}
        </div>
    );
};

export default AdCard;