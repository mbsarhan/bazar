// src/frontend/components/AdDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // 1. Use the context
import { useUser } from '../context/UserContext';
import AdDetailSkeleton from './AdDetailSkeleton'; // 2. Import the skeleton
import '../styles/AdDetailPage.css';
import { 
    ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench, 
    Home, Square, BedDouble, Bath 
} from 'lucide-react';

const AdDetailPage = () => {
    const { adId } = useParams();
    const { getAdById } = useAds(); // 3. Get the fetching function from context
    const { currentUser } = useUser();

    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbnailScrollerRef = React.useRef(null);

    useEffect(() => {
        const fetchAd = async () => {
            setIsLoading(true);
            setError(null);
            setAd(null);
            try {
                const data = await getAdById(parseInt(adId, 10));
                setAd(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }, [adId, getAdById]);

    // Auto-scroll thumbnail into view when currentIndex changes
    useEffect(() => {
        if (thumbnailScrollerRef.current && ad && ad.imageUrls.length > 1) {
            const thumbnails = thumbnailScrollerRef.current.children;
            if (thumbnails[currentIndex]) {
                thumbnails[currentIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [currentIndex, ad]);

    const formatNumber = (num) => num ? num.toLocaleString('en-US') : '0';

    const prevSlide = () => {
        if (!ad) return;
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? ad.imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        if (!ad) return;
        const isLastSlide = currentIndex === ad.imageUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

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
                    {/* Main Image Display */}
                    <div className="main-image-container">
                        <img src={ad.imageUrls[currentIndex]} alt={`${ad.title} - ${currentIndex + 1}`} className="main-image"/>
                        {ad.imageUrls.length > 1 && (
                            <>
                                <button className="gallery-arrow left" onClick={nextSlide}><ChevronLeft size={32} /></button>
                                <button className="gallery-arrow right" onClick={prevSlide}><ChevronRight size={32} /></button>
                            </>
                        )}
                    </div>
                    {/* --- The Thumbnail Scroller --- */}
                    {ad.imageUrls.length > 1 && (
                        <div className="thumbnail-scroller">
                            {ad.imageUrls.map((url, index) => (
                                <div 
                                    key={index}
                                    className={`thumbnail-image ${currentIndex === index ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img src={url} alt={`Thumbnail ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Ad Details Info */}
                <div className="ad-detail-info">
                    <h3>التفاصيل الأساسية</h3>
                    <div className="info-grid">
                        {ad.model_year && (
                            <>
                                <div className="info-item"><strong><Wrench size={16}/> الحالة:</strong> <span>{ad.condition}</span></div>
                                <div className="info-item"><strong><Calendar size={16}/> سنة الصنع:</strong> <span>{ad.model_year}</span></div>
                                <div className="info-item"><strong><MapPin size={16}/> المحافظة:</strong> <span>{ad.governorate}</span></div>
                                <div className="info-item"><strong><GaugeCircle size={16}/> المسافة المقطوعة:</strong> <span>{formatNumber(ad.distance_traveled)} كم</span></div>
                                <div className="info-item"><strong><GitCommitVertical size={16}/> ناقل الحركة:</strong> <span>{ad.gear}</span></div>
                                <div className="info-item"><strong><Fuel size={16}/> نوع الوقود:</strong> <span>{ad.fuel_type}</span></div>
                            </>
                        )}
                        {ad.realestate_type && (
                            <>
                                <div className="info-item"><strong><Home size={16}/> نوع العقار:</strong> <span>{ad.realestate_type}</span></div>
                                <div className="info-item"><strong><MapPin size={16}/> الموقع:</strong> <span>{ad.location}</span></div>
                                <div className="info-item"><strong><Square size={16}/> المساحة:</strong> <span>{ad.area} م²</span></div>
                                <div className="info-item"><strong><BedDouble size={16}/> غرف النوم:</strong> <span>{ad.bedroom_num}</span></div>
                                <div className="info-item"><strong><Bath size={16}/> الحمامات:</strong> <span>{ad.bathroom_num}</span></div>
                            </>
                        )}
                    </div>
                    <h3>الوصف</h3>
                    <p className="ad-detail-description">{ad.description || 'لا يوجد وصف متاح.'}</p>
                    <div className="seller-info">
                        <h4>معلومات المعلن</h4>
                        <p>
                            اسم المعلن: 
                            <Link to={
    currentUser && currentUser.id === ad.owner.id
      ? '/dashboard'
      : `/profile/${ad.owner.id}`
  } className="seller-name-link">
                                <strong>{ad.owner?.name || 'مستخدم بازار'}</strong>
                            </Link>
                        </p>
                        <button className="submit-btn">إظهار رقم الهاتف</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;