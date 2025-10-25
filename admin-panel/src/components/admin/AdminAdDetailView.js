// admin-panel/src/components/admin/AdminAdDetailView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';    
import { useAdmin } from '../../context/AdminContext'; // Use the admin context
import '../../styles/AdDetailPage.css';

const AdminAdDetailView = () => {
    const { adId } = useParams();
    const navigate = useNavigate();
    const { getPendingUpdateById, approveUpdate, rejectUpdate } = useAdmin();



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
                const data = await getPendingUpdateById(adId);
                setAd(data);
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

    if (isLoading) return <p>جاري تحميل تفاصيل الإعلان...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!ad) return <p>لم يتم العثور على الإعلان.</p>;

    return (
        <div>
            <div className="content-header">
                <h1>تفاصيل الإعلان: {ad.title}</h1>
                {/* --- THIS IS THE FIX --- */}
                {/* Changed className from "submit-btn" to a new, specific class */}
                <Link to="/manage-ads" className="back-link-btn">العودة إلى القائمة</Link>
            </div>

            {/* --- FULL IMAGE AND VIDEO GALLERY --- */}
            <div className="ad-detail-main-content">
                <div className="ad-detail-image-gallery">
                    <div className="main-image-container">
                        <img src={ad.imageUrls[currentIndex]} alt={`${ad.title} - ${currentIndex + 1}`} className="main-image" />
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
                            <video controls width="100%">
                                <source src={ad.videoUrl} type="video/mp4" />
                            </video>
                        </div>
                    </div>
                )}
            </div>

            <div className="admin-detail-view">
                <h3>المعلومات الأساسية</h3>
                <ul>
                    <li><strong>المعرف:</strong> {ad.id}</li>
                    <li><strong>العنوان:</strong> {ad.title}</li>
                    <li><strong>السعر:</strong> {ad.price}</li>
                    <li><strong>صاحب الإعلان:</strong> {ad.owner.name} (ID: {ad.owner.id})</li>
                    <li><strong>تاريخ النشر:</strong> {ad.created_at.split("T")[0]}</li>
                    <li><strong>الحالة الحالية:</strong> {ad.status}</li>
                </ul>

                <div className="actions-cell" style={{ marginTop: '30px' }}>
                    <button className="action-btn approve" onClick={handleApprove}>موافقة على الإعلان</button>
                    <button className="action-btn reject" onClick={handleReject}>رفض الإعلان</button>
                </div>
            </div>
        </div>
    );
};

export default AdminAdDetailView;