// admin-panel/src/components/admin/AdminAdDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, GitCommitVertical, Fuel, Wrench,
    Home, Square, BedDouble, Bath } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';    
import { useAdmin } from '../../context/AdminContext'; // Use the admin context
import AdDetailSkeleton from '../AdDetailSkeleton'; 
import '../../styles/AdDetailPage.css';
import '../../styles/AdminPages.css'; 

const AdminAdDetailView = () => {
    const { adId } = useParams();
    const navigate = useNavigate();
    const { getPendingUpdateById, approveUpdate, rejectUpdate, getAdById } = useAdmin();
    const formatNumber = (num) => num ? num.toLocaleString('en-US') : '0';

    const location = useLocation(); // 2. Get the location object

    // Determine what type of ad we're viewing from the state passed by the link
    const viewType = location.state?.type || 'pending'; // Default to 'active' if state is missing


    const [ad, setAd] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch the detailed pending update data
    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                let data;
                if (viewType === 'pending') {
                    // If it's a pending ad, fetch the pending details
                    data = await getPendingUpdateById(adId);
                } else {
                    // If it's an active ad, use the general ad fetcher
                    data = await getAdById(adId);
                }
                setAd(data);
            } catch (err) {
                setError("Failed to fetch ad details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [adId, viewType, getPendingUpdateById, getAdById]); // Effect depends on the ID and type



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
    
    const isPending = viewType === 'pending';
    return (
        // --- 4. THE UI STRUCTURE NOW MIRRORS THE MAIN SITE ---
        <div className="ad-detail-container">
            <div className="ad-detail-header">
                <h1>{isPending ? 'مراجعة التعديلات' : 'تفاصيل الإعلان'}: {ad.title}</h1>
                <Link to="/manage-ads" className="back-link-btn">العودة إلى القائمة</Link>
            </div>

            <div className="ad-detail-content">
                <div className="ad-detail-main-content">
                    <div className="ad-detail-image-gallery">
                        <div className="main-image-container">
                            <img src={ad.imageUrls[currentIndex]} alt={`${ad.title} - ${currentIndex + 1}`} className="main-image"/>
                            {ad.imageUrls.length > 1 && (
                                <>
                                    <button className="gallery-arrow left" onClick={prevSlide}><ChevronLeft size={32} /></button>
                                    <button className="gallery-arrow right" onClick={nextSlide}><ChevronRight size={32} /></button>
                                </>
                            )}
                        </div>
                        {ad.imageUrls.length > 1 && (
                            <Swiper className="thumbnail-swiper" spaceBetween={10} slidesPerView={'auto'} freeMode={true}>
                                {ad.imageUrls.map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <div className={`thumbnail-image ${currentIndex === index ? 'active' : ''}`} onClick={() => setCurrentIndex(index)}>
                                            <img src={url} alt={`Thumbnail ${index + 1}`} />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {ad.videoUrl && (
                        <div className="video-section">
                            <h3>فيديو الإعلان</h3>
                            <div className="video-player-wrapper">
                                <video controls width="100%"><source src={ad.videoUrl} type="video/mp4" /></video>
                            </div>
                        </div>
                    )}
                </div>
                
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