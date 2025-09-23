// src/components/AdDetailPage.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { carAdsData, realEstateAdsData } from './dashboard/mockData';
import '../styles/AdDetailPage.css';
import { 
    GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench, 
    Home, Square, BedDouble, Bath 
} from 'lucide-react';

const AdDetailPage = () => {
    const { adId } = useParams();
    const allAds = [...carAdsData, ...realEstateAdsData];
    const ad = allAds.find(ad => ad.id === parseInt(adId, 10));

    const formatNumber = (num) => num ? num.toLocaleString('en-US') : 'غير محدد';

    if (!ad) {
        return (
            <div className="ad-detail-container not-found">
                <h2>الإعلان غير موجود</h2>
                <p>عفواً، الإعلان الذي تبحث عنه لم يعد متوفراً.</p>
                <Link to="/" className="submit-btn">العودة إلى الصفحة الرئيسية</Link>
            </div>
        );
    }

    return (
        <div className="ad-detail-container">
            <div className="ad-detail-header">
                <h1>{ad.title}</h1>
                <span className="ad-detail-price">{ad.price}</span>
            </div>
            <div className="ad-detail-content">
                <div className="ad-detail-image-gallery">
                    {/* --- هذا هو السطر الذي تم إصلاحه --- */}
                    {/* نعرض الصورة الأولى من المصفوفة */}
                    <img src={ad.imageUrls[0]} alt={ad.title} className="main-image"/>
                </div>
                <div className="ad-detail-info">
                    <h3>التفاصيل الأساسية</h3>
                    <div className="info-grid">
                        {ad.year && (
                            <>
                                <div className="info-item"><strong><Wrench size={16}/> الحالة:</strong> <span>{ad.condition}</span></div>
                                <div className="info-item"><strong><Calendar size={16}/> سنة الصنع:</strong> <span>{ad.year}</span></div>
                                <div className="info-item"><strong><MapPin size={16}/> المحافظة:</strong> <span>{ad.location.split(',')[0]}</span></div>
                                <div className="info-item"><strong><GaugeCircle size={16}/> المسافة المقطوعة:</strong> <span>{formatNumber(ad.mileage)} كم</span></div>
                                <div className="info-item"><strong><GitCommitVertical size={16}/> ناقل الحركة:</strong> <span>{ad.transmission}</span></div>
                                <div className="info-item"><strong><Fuel size={16}/> نوع الوقود:</strong> <span>{ad.fuelType}</span></div>
                            </>
                        )}
                        {ad.propertyType && (
                            <>
                                <div className="info-item"><strong><Home size={16}/> نوع العقار:</strong> <span>{ad.propertyType}</span></div>
                                <div className="info-item"><strong><MapPin size={16}/> الموقع:</strong> <span>{ad.location}</span></div>
                                <div className="info-item"><strong><Square size={16}/> المساحة:</strong> <span>{ad.area} م²</span></div>
                                <div className="info-item"><strong><BedDouble size={16}/> غرف النوم:</strong> <span>{ad.bedrooms}</span></div>
                                <div className="info-item"><strong><Bath size={16}/> الحمامات:</strong> <span>{ad.bathrooms}</span></div>
                            </>
                        )}
                    </div>
                    
                    <h3>الوصف</h3>
                    <p className="ad-detail-description">
                        هذا وصف تجريبي للإعلان. في التطبيق الحقيقي، سيتم عرض الوصف الكامل الذي أدخله المستخدم هنا، شاملاً جميع التفاصيل والميزات الخاصة بالسيارة أو العقار.
                    </p>
                    
                    <div className="seller-info">
                        <h4>معلومات المعلن</h4>
                        <p>اسم المعلن: <strong>اسم تجريبي</strong></p>
                        <button className="submit-btn">إظهار رقم الهاتف</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;