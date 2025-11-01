// src/frontend/components/AdDetailPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Import useLocation
import { useAds } from '../context/AdContext';
import { useAuth } from '../context/AuthContext';

import AdDetailSkeleton from './AdDetailSkeleton';
import '../styles/AdDetailPage.css';
import {
    ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench,
    Home, Square, BedDouble, Bath
} from 'lucide-react';

import VideoPlayer from './VideoPlayer';

const AdDetailPage = () => {
    const { adId } = useParams();
    const { getAdById, getPublicAds } = useAds();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // 2. Get the location object to access state

    // This state will hold the list of ad IDs for navigation.
    // It will be populated from the navigation state if available.
    const [adIdList, setAdIdList] = useState([]);

    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbnailScrollerRef = useRef(null);
    const [videoPlayerOptions, setVideoPlayerOptions] = useState(null);

    useEffect(() => {
        const fetchAd = async () => {
            setIsLoading(true);
            setError(null);
            setAd(null);
            try {
                const data = await getAdById(parseInt(adId, 10));
                console.log("API Response for Ad:", data);
                setAd(data);
                if (data && data.videoUrl && data.videoType) {
                    setVideoPlayerOptions({
                        autoplay: false,
                        controls: true,
                        responsive: true,
                        fluid: true,
                        sources: [{
                            src: data.videoUrl,
                            type: data.videoType
                        }]
                    });
                } else {
                    setVideoPlayerOptions(null);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAd();
    }, [adId, getAdById]);

    // 3. This effect now sets the ad list for navigation
    useEffect(() => {
        const fetchAndSetAdIds = async () => {
            // If a list of IDs was passed from the previous page, use it.
            if (location.state && location.state.filteredAdIds) {
                setAdIdList(location.state.filteredAdIds);
            } else {
                // As a fallback, fetch all public ads and map to their IDs.
                try {
                    const publicAds = await getPublicAds();
                    const ids = publicAds.map(ad => ad.id);
                    setAdIdList(ids);
                } catch (err) {
                    console.error("Error fetching ads for navigation:", err);
                }
            }
        };
        fetchAndSetAdIds();
    }, [location.state, getPublicAds]);


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

    const handlePlayerReady = (player) => {
        console.log('Video.js player is ready on the detail page!', player);
    };

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

    // 4. Update navigation logic to use the new `adIdList`
    const currentAdIndexInList = adIdList.findIndex(id => id === Number(adId));

    const handleNextAd = () => {
        if (currentAdIndexInList < adIdList.length - 1) {
            const nextAdId = adIdList[currentAdIndexInList + 1];
            // Pass the state along so the next page also has the context
            navigate(`/ad/${nextAdId}`, { state: { filteredAdIds: adIdList } });
        }
    };

    const handlePrevAd = () => {
        if (currentAdIndexInList > 0) {
            const prevAdId = adIdList[currentAdIndexInList - 1];
            // Pass the state along so the next page also has the context
            navigate(`/ad/${prevAdId}`, { state: { filteredAdIds: adIdList } });
        }
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
            <div className="ad-navigation-buttons">
                {/* 5. Logic for disabling buttons is now also based on the new list */}
                <button onClick={handlePrevAd} disabled={currentAdIndexInList <= 0}>
                    الإعلان السابق →
                </button>
                <button onClick={() => navigate('/')} className="home-button">
                    الصفحة الرئيسية
                </button>
                <button onClick={handleNextAd} disabled={currentAdIndexInList >= adIdList.length - 1}>
                    ← الإعلان التالي
                </button>
            </div>
            <div className="ad-detail-header">
                <h1>{ad.title}</h1>
                <span className="ad-detail-price">{`${!ad.price ? 'السعر عند التواصل' : `${ad.price} $`}
                     ${ad.negotiable_check ? '(قابل للتفاوض)' : ''}`}</span>
            </div>

            <div className="ad-detail-content">
                <div className="ad-detail-image-gallery">
                    {/* Main Image Display */}
                    <div className="main-image-container">
                        {currentIndex === -1 && videoPlayerOptions ? (
                            <VideoPlayer options={videoPlayerOptions} onReady={handlePlayerReady} />
                        ) : (
                            <img
                                src={ad.imageUrls[currentIndex]}
                                alt={`${ad.title} - ${currentIndex + 1}`}
                                className="main-image"
                            />
                        )}
                        {ad.imageUrls.length > 1 && (
                            <>
                                <button className="gallery-arrow left" onClick={prevSlide}><ChevronLeft size={32} /></button>
                                <button className="gallery-arrow right" onClick={nextSlide}><ChevronRight size={32} /></button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails Container */}
                    <div className="thumbnail-container-wrapper">
                        {/* Video Thumbnails */}
                        <div className="video-thumbnails">
                            {videoPlayerOptions && (
                                <div className={`video-thumbnail ${currentIndex === -1 ? 'active' : ''}`} onClick={() => setCurrentIndex(-1)}>
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Thumbnails */}
                        {ad.imageUrls.length > 0 && (
                            <div className="thumbnail-scroller" ref={thumbnailScrollerRef}>
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
                </div>

                {/* Ad Details Info */}
                <div className="ad-detail-info">
                    <h3>التفاصيل الأساسية</h3>
                    <div className="info-grid">
                        {ad.model_year && (
                            <>
                                <div className="info-item"><strong><Wrench size={16} /> الحالة:</strong> <span>{ad.condition}</span></div>
                                <div className="info-item"><strong><Calendar size={16} /> سنة الصنع:</strong> <span>{ad.model_year}</span></div>
                                <div className="info-item"><strong><MapPin size={16} /> المحافظة:</strong> <span>{ad.governorate}</span></div>
                                <div className="info-item"><strong><GaugeCircle size={16} /> المسافة المقطوعة:</strong> <span>{formatNumber(ad.distance_traveled)} كم</span></div>
                                <div className="info-item"><strong><GitCommitVertical size={16} /> ناقل الحركة:</strong> <span>{ad.gear}</span></div>
                                <div className="info-item"><strong><Fuel size={16} /> نوع الوقود:</strong> <span>{ad.fuel_type}</span></div>
                            </>
                        )}
                        {ad.realestate_type && (
                            <>
                                <div className="info-item"><strong><Home size={16} /> نوع العقار:</strong> <span>{ad.realestate_type}</span></div>
                                <div className="info-item"><strong><MapPin size={16} /> الموقع:</strong> <span>{ad.location}</span></div>
                                <div className="info-item"><strong><MapPin size={16} /> الموقع التفصيلي:</strong> <span>{ad.detailed_address}</span></div>
                                <div className="info-item"><strong><Square size={16} /> المساحة:</strong> <span>{ad.area} م²</span></div>
                                <div className="info-item"><strong><BedDouble size={16} /> غرف النوم:</strong> <span>{ad.bedroom_num}</span></div>
                                <div className="info-item"><strong><Bath size={16} /> الحمامات:</strong> <span>{ad.bathroom_num}</span></div>
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
                                user && user.id === ad.owner.id
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