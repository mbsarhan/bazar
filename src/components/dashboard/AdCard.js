// src/components/dashboard/AdCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench, 
    Home, Square, BedDouble, Bath, ChevronLeft, ChevronRight,
} from 'lucide-react';

// أيقونات SVG بسيطة للأزرار
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
const ViewIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;

const AdCard = ({ ad, isPublic = false }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const getStatusClass = (status) => {
        if (status === 'فعال') return 'status-active';
        if (status === 'قيد المراجعة') return 'status-pending';
        if (status === 'مباع' || status === 'مؤجر') return 'status-sold';
        return '';
    };
    
    const formatNumber = (num) => num ? num.toLocaleString('en-US') : 'غير محدد';
    
    const prevSlide = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? ad.imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    // Logic for NEXT slide
    const nextSlide = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isLastSlide = currentIndex === ad.imageUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="ad-card">
            <Link to={`/ad/${ad.id}`} className="ad-card-clickable-area">
                <div className="ad-card-image">
                    <img src={ad.imageUrls[currentIndex]} alt={ad.title} />
                    
                    {/* 5. إضافة الأسهم والنقاط (ستظهر فقط إذا كان هناك أكثر من صورة) */}
                    {ad.imageUrls.length > 1 && (
                        <>
                            {/* الأسهم */}
                            <button className="nav-arrow left" onClick={prevSlide}><ChevronLeft size={24} /></button>
                            <button className="nav-arrow right" onClick={nextSlide}><ChevronRight size={24} /></button>
                            
                            {/* النقاط */}
                            <div className="pagination-dots">
                                {ad.imageUrls.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    {!isPublic && (
                        <span className={`ad-card-status ${getStatusClass(ad.status)}`}>
                            {ad.status}
                        </span>
                    )}
                </div>
                <div className="ad-card-details">
                    <h3>{ad.title}</h3>
                    <p className="ad-card-price">{ad.price}</p>
                    <div className="ad-card-specs">
                        {/* Car Specs */}
                        {ad.year && (
                            <>
                                <div className="spec-item"><Wrench size={16} /><span>{ad.condition}</span></div>
                                <div className="spec-item"><Calendar size={16} /><span>{ad.year}</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.location.split(',')[0]}</span></div>
                                <div className="spec-item"><GaugeCircle size={16} /><span>{formatNumber(ad.mileage)} كم</span></div>
                                <div className="spec-item"><GitCommitVertical size={16} /><span>{ad.transmission}</span></div>
                                <div className="spec-item"><Fuel size={16} /><span>{ad.fuelType}</span></div>
                            </>
                        )}
                        {/* Real Estate Specs */}
                        {ad.propertyType && (
                            <>
                                <div className="spec-item"><Home size={16} /><span>{ad.propertyType}</span></div>
                                <div className="spec-item"><Square size={16} /><span>{ad.area} م²</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.location}</span></div>
                                <div className="spec-item"><BedDouble size={16} /><span>{ad.bedrooms} غرف نوم</span></div>
                                <div className="spec-item"><Bath size={16} /><span>{ad.bathrooms} حمامات</span></div>
                            </>
                        )}
                    </div>
                </div>
            </Link>

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