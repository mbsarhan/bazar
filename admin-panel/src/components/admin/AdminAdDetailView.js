// admin-panel/src/components/admin/AdminAdDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench,
    Home, Square, BedDouble, Bath
} from 'lucide-react';
import 'swiper/css';
import { useAdmin } from '../../context/AdminContext'; // Use the admin context
import AdDetailSkeleton from '../AdDetailSkeleton';
import VideoPlayer from '../VideoPlayer';
import '../../styles/AdDetailPage.css';
import '../../styles/AdminPages.css';

const AdminAdDetailView = () => {
    const { adId } = useParams();
    const navigate = useNavigate();
    const { getPendingUpdateById, approveUpdate, rejectUpdate } = useAdmin();
    const formatNumber = (num) => num ? num.toLocaleString('en-US') : '0';


    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoPlayerOptions, setVideoPlayerOptions] = useState(null);

    // Fetch the detailed pending update data
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPendingUpdateById(adId);
                setAd(data);
                if (data && data.videoUrl && data.videoType) {
                    setVideoPlayerOptions({
                        autoplay: false,
                        controls: true,
                        responsive: true,
                        fluid: true,
                        sources: [{
                            src: data.videoUrl,
                            type: data.videoType // Use the type from the backend
                        }]
                    });
                } else {
                    setVideoPlayerOptions(null); // Ensure it's null if no video
                }
            } catch (err) {
                setError("Failed to fetch ad details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [adId, getPendingUpdateById]);


    const prevSlide = () => {
        if (!ad) return;
        const newIndex = currentIndex === 0 ? ad.imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };
    const nextSlide = () => {
        if (!ad) return;
        const newIndex = currentIndex === ad.imageUrls.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const handlePlayerReady = (player) => {
        console.log('Video.js player is ready on the detail page!', player);
        // Video.js will automatically add the quality selector for HLS streams.
    };


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

    if (isLoading) {
        return <AdDetailSkeleton />;
    }
    if (error) return <p className="error-message">{error}</p>;
    if (!ad) return <p>لم يتم العثور على الإعلان.</p>;

    return (
        // --- 4. THE UI STRUCTURE NOW MIRRORS THE MAIN SITE ---
        <div className="ad-detail-container">
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
                                <button className="gallery-arrow left" onClick={nextSlide}><ChevronLeft size={32} /></button>
                                <button className="gallery-arrow right" onClick={prevSlide}><ChevronRight size={32} /></button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails Container */}
                    <div className="thumbnail-container-wrapper">
                        {/* Video Thumbnails - Left Side (space always reserved) */}
                        <div className="video-thumbnails">
                            {videoPlayerOptions && (
                                <div className={`video-thumbnail ${currentIndex === -1 ? 'active' : ''}`} onClick={() => setCurrentIndex(-1)}>
                                    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Photo Thumbnails - Right Side */}
                        {ad.imageUrls.length && (
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

                    <div className="admin-actions-box">
                        <h4>الإجراءات الإدارية</h4>
                        <p>يرجى مراجعة محتوى الإعلان بعناية قبل الموافقة عليه.</p>
                        <div className="actions-cell">
                            <button className="action-btn approve" onClick={handleApprove}>موافقة</button>
                            <button className="action-btn reject" onClick={handleReject}>رفض</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAdDetailView;