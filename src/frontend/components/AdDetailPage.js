// src/frontend/components/AdDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // 1. Use the context
import AdDetailSkeleton from './AdDetailSkeleton'; // 2. Import the skeleton
import '../styles/AdDetailPage.css';
import { 
    GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench, 
    Home, Square, BedDouble, Bath 
} from 'lucide-react';

const AdDetailPage = () => {
    const { adId } = useParams();
    const { getAdById } = useAds(); // 3. Get the fetching function from context

    // 4. Set up state for ad data, loading, and errors
    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 5. Use useEffect to fetch the specific ad data
    useEffect(() => {
        const fetchAd = async () => {
            // Reset state on new adId
            setIsLoading(true);
            setError(null);
            

            try {
                // The API call to get a single item does not have a wrapping 'data' key
                const data = await getAdById(parseInt(adId, 10));
                // We need to access result.data from the API response
                setAd(data); // <-- THE FIX
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }, [adId, getAdById]); // Re-run if adId or the function changes
    const formatNumber = (num) => num ? num.toLocaleString('en-US') : '0';

    // --- 6. RENDER STATES ---

    if (isLoading) {
        return <AdDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="ad-detail-container not-found">
                <h2>حدث خطأ</h2>
                <p>{error}</p>
                <Link to="/" className="submit-btn">العودة إلى الصفحة الرئيسية</Link>
            </div>
        );
    }
    
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
                    {/* Assuming the first image is the main one */}
                    <img src={ad.imageUrls[0]} alt={ad.title} className="main-image"/>
                </div>
                <div className="ad-detail-info">
                    <h3>التفاصيل الأساسية</h3>
                    <div className="info-grid">
                        {ad.year && ( /* Car Details */
                            <>
                                <div className="info-item"><strong><Wrench size={16}/> الحالة:</strong> <span>{ad.condition}</span></div>
                                <div className="info-item"><strong><Calendar size={16}/> سنة الصنع:</strong> <span>{ad.year}</span></div>
                                <div className="info-item"><strong><MapPin size={16}/> المحافظة:</strong> <span>{ad.location.split(',')[0]}</span></div>
                                <div className="info-item"><strong><GaugeCircle size={16}/> المسافة المقطوعة:</strong> <span>{formatNumber(ad.mileage)} كم</span></div>
                                <div className="info-item"><strong><GitCommitVertical size={16}/> ناقل الحركة:</strong> <span>{ad.transmission}</span></div>
                                <div className="info-item"><strong><Fuel size={16}/> نوع الوقود:</strong> <span>{ad.fuelType}</span></div>
                            </>
                        )}
                        {ad.propertyType && ( /* Real Estate Details */
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
                    <p className="ad-detail-description">{ad.description || 'لا يوجد وصف متاح.'}</p>
                    <div className="seller-info">
                        <h4>معلومات المعلن</h4>
                        <p>اسم المعلن: <strong>{ad.owner?.name || 'مستخدم بازار'}</strong></p>
                        <button className="submit-btn">إظهار رقم الهاتف</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;