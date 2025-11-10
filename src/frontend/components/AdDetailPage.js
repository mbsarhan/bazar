// src/frontend/components/AdDetailPage.js - Redesigned
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAds } from '../context/AdContext';
import { useAuth } from '../context/AuthContext';
import AdDetailSkeleton from './AdDetailSkeleton';
import '../styles/AdDetailPage.css';
import {
    ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, GitCommitVertical,
    Fuel, Wrench, Home as HomeIcon, Square, BedDouble, Bath, Phone, MessageCircle,
    Share2, Eye, Heart
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const AdDetailPage = () => {
    const { adId } = useParams();
    const { getAdById, getPublicAds } = useAds();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        const fetchAndSetAdIds = async () => {
            if (location.state && location.state.filteredAdIds) {
                setAdIdList(location.state.filteredAdIds);
            } else {
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

    const currentAdIndexInList = adIdList.findIndex(id => id === Number(adId));

    const handleNextAd = () => {
        if (currentAdIndexInList < adIdList.length - 1) {
            const nextAdId = adIdList[currentAdIndexInList + 1];
            navigate(`/ad/${nextAdId}`, { state: { filteredAdIds: adIdList } });
        }
    };

    const handlePrevAd = () => {
        if (currentAdIndexInList > 0) {
            const prevAdId = adIdList[currentAdIndexInList - 1];
            navigate(`/ad/${prevAdId}`, { state: { filteredAdIds: adIdList } });
        }
    };

    const handleChatClick = () => {
        if (user) {
            navigate(`/chat/${ad.owner.id}`);
        } else {
            navigate('/login', { state: { from: `/ad/${adId}` } });
        }
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator.share({
                title: ad.title,
                text: ad.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('تم نسخ الرابط');
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

    const returnToPath = location.state?.returnTo || '/';

    return (
        <div className="ad-detail-container">
            {/* Navigation Bar */}


            {/* Main Content Grid */}
            <div className="ad-detail-grid">
                {/* Left Column - Gallery */}
                <div className="ad-gallery-section">
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
                                <button className="gallery-arrow left" onClick={nextSlide}>
                                    <ChevronLeft size={28} />
                                </button>
                                <button className="gallery-arrow right" onClick={prevSlide}>
                                    <ChevronRight size={28} />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        <div className="image-counter">
                            {currentIndex + 1} / {ad.imageUrls.length}
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="thumbnails-grid" ref={thumbnailScrollerRef}>
                        {videoPlayerOptions && (
                            <div
                                className={`thumbnail-item ${currentIndex === -1 ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(-1)}
                            >
                                <div className="video-thumb-overlay">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                        {ad.imageUrls.map((url, index) => (
                            <div
                                key={index}
                                className={`thumbnail-item ${currentIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img src={url} alt={`Thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="ad-details-section">
                    {/* Header Card */}
                    <div className="detail-card header-card">
                        <div className="ad-stats">
                            <div className="stat-item">
                                <Eye size={18} />
                                <span>{formatNumber(ad.views)} مشاهدة</span>
                            </div>
                            <button className="icon-btn" onClick={handleShareClick}>
                                <Share2 size={20} />
                            </button>
                            <button className="icon-btn">
                                <Heart size={20} />
                            </button>
                        </div>

                        <h1 className="ad-title">{ad.title}</h1>

                        <div className="price-section">
                            <span className="ad-price">
                                {!ad.price ? 'السعر عند التواصل' : `${formatNumber(ad.price)} $`}
                            </span>
                            {/* {ad.negotiable_check && (
                                <span className="negotiable-badge">قابل للتفاوض</span>
                            )} */}
                        </div>
                    </div>

                    {/* Specs Card */}
                    <div className="detail-card specs-card">
                        <h3>المواصفات</h3>
                        <div className="specs-grid">
                            {ad.model_year && (
                                <>
                                    <div className="AdDetail-spec-item">
                                        <Wrench size={18} />
                                        <div>
                                            <span className="spec-label">الحالة</span>
                                            <span className="spec-value">{ad.condition}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <Calendar size={18} />
                                        <div>
                                            <span className="spec-label">سنة الصنع</span>
                                            <span className="spec-value">{ad.model_year}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <MapPin size={18} />
                                        <div>
                                            <span className="spec-label">المحافظة</span>
                                            <span className="spec-value">{ad.governorate}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <GaugeCircle size={18} />
                                        <div>
                                            <span className="spec-label">المسافة المقطوعة</span>
                                            <span className="spec-value">{formatNumber(ad.distance_traveled)} كم</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <GitCommitVertical size={18} />
                                        <div>
                                            <span className="spec-label">ناقل الحركة</span>
                                            <span className="spec-value">{ad.gear}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <Fuel size={18} />
                                        <div>
                                            <span className="spec-label">نوع الوقود</span>
                                            <span className="spec-value">{ad.fuel_type}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                            {ad.realestate_type && (
                                <>
                                    <div className="AdDetail-spec-item">
                                        <HomeIcon size={18} />
                                        <div>
                                            <span className="spec-label">نوع العقار</span>
                                            <span className="spec-value">{ad.realestate_type}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <Square size={18} />
                                        <div>
                                            <span className="spec-label">المساحة</span>
                                            <span className="spec-value">{ad.area} م²</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <BedDouble size={18} />
                                        <div>
                                            <span className="spec-label">غرف النوم</span>
                                            <span className="spec-value">{ad.bedroom_num}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <Bath size={18} />
                                        <div>
                                            <span className="spec-label">الحمامات</span>
                                            <span className="spec-value">{ad.bathroom_num}</span>
                                        </div>
                                    </div>
                                    <div className="AdDetail-spec-item">
                                        <MapPin size={18} />
                                        <div>
                                            <span className="spec-label">الموقع التفصيلي</span>
                                            <span className="spec-value">{ad.detailed_address}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="detail-card description-card">
                        <h3>الوصف</h3>
                        <p>{ad.description || 'لا يوجد وصف متاح.'}</p>
                    </div>

                    {/* Seller Card */}
                    <div className="detail-card seller-card">
                        <h3>معلومات البائع</h3>
                        <div className="seller-info">
                            <div className="seller-avatar">
                                {ad.owner?.name?.charAt(0) || 'M'}
                            </div>
                            <div className="seller-details">
                                <Link
                                    to={user && user.id === ad.owner.id ? '/dashboard' : `/profile/${ad.owner.id}`}
                                    className="seller-name"
                                >
                                    {ad.owner?.name || 'مستخدم بازار'}
                                </Link>
                                <span className="seller-label">البائع</span>
                            </div>
                        </div>

                        <div className="AdDetail-contact-buttons">
                            <button className="AdDetail-contact-button AdDetail-chat-btn" onClick={handleChatClick}>
                                <MessageCircle size={20} />
                                <span>محادثة</span>
                            </button>
                            <button className="AdDetail-contact-button AdDetail-phone-btn">
                                <Phone size={20} />
                                <span>اتصال</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="ad-navigation-bar">
                    <button onClick={handlePrevAd} disabled={currentAdIndexInList <= 0} className="nav-btn">
                        <ChevronRight size={20} />
                        <span>السابق</span>
                    </button>
                    <button onClick={() => navigate(returnToPath)} className="home-btn">
                        الرئيسية
                    </button>
                    <button onClick={handleNextAd} disabled={currentAdIndexInList >= adIdList.length - 1} className="nav-btn">
                        <span>التالي</span>
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;