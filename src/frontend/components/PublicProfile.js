// src/frontend/components/PublicProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Star, Flag } from 'lucide-react'; // Import icons
import StarRating from './dashboard/StarRating';
import AdCard from './dashboard/AdCard';
import '../styles/PublicProfile.css';


const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { getPublicProfile } = useUser();
    const { user: loggedInUser } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPublicProfile(userId);
                setProfileData(data);
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'لا يمكن تحميل الملف الشخصي للمستخدم.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [userId, getPublicProfile]);

    const handleAddReviewClick = () => {
        if (loggedInUser) {
            navigate(`/add-review/${userId}`);
        } else {
            navigate('/login', { state: { from: `/profile/${userId}` } });
        }
    };

    const handleReportUserClick = () => {
        if (loggedInUser) {
            // Navigate to report page (you'll need to create this)
            navigate(`/report-user/${userId}`);
        } else {
            navigate('/login', { state: { from: `/profile/${userId}` } });
        }
    };

    if (isLoading) {
        return <div className="profile-page-container"><p>جاري تحميل الملف الشخصي...</p></div>;
    }

    if (error) {
        return <div className="profile-page-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="profile-page-container">
            {/* --- Profile Header --- */}
            <div className="profile-header-card">
                <div className="profile-avatar">
                    <span>{profileData.user.name.charAt(0)}</span>
                </div>
                <div className="profile-header-info">
                    <h1>{profileData.user.name}</h1>
                    <p className="member-since">عضو منذ {profileData.user.memberSince}</p>
                    <div className="profile-header-rating">
                        <StarRating rating={profileData.reviews.averageRating} size={24} />
                        <span className="rating-value">{profileData.reviews.averageRating.toFixed(1)}</span>
                        <span className="rating-count">({profileData.reviews.totalReviews} تقييمات)</span>
                    </div>
                </div>
                {loggedInUser?.id !== parseInt(userId) && (
                    <div className="profile-action-buttons">
                        <button 
                            className="profile-action-btn add-review-btn" 
                            onClick={handleAddReviewClick}
                        >
                            <Star size={18} />
                            <span>أضف تقييمك</span>
                        </button>
                        <button 
                            className="profile-action-btn report-btn" 
                            onClick={handleReportUserClick}
                        >
                            <Flag size={18} />
                            <span>إبلاغ</span>
                        </button>
                    </div>
                )}
            </div>

            {/* --- Active Ads Section --- */}
            <div className="profile-section">
                <h2>الإعلانات النشطة ({profileData.ads.length})</h2>
                {profileData.ads.length > 0 ? (
                    <div className="ads-list-container">
                        {profileData.ads.map(ad => (
                            <AdCard key={ad.id} ad={ad} isPublic={true} />
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">لا توجد إعلانات نشطة حالياً</p>
                )}
            </div>
            
            {/* --- Reviews Section --- */}
            <div className="profile-section">
                <h2>التقييمات ({profileData.reviews.totalReviews})</h2>
                {profileData.reviews.reviews.length > 0 ? (
                    <div className="reviews-list">
                        {profileData.reviews.reviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-card-header">
                                    <div className="reviewer-info">
                                        <span className="reviewer-name">{review.reviewerName}</span>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                    <StarRating rating={review.rating} size={20} />
                                </div>
                                <p className="review-comment">"{review.comment}"</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">لا توجد تقييمات بعد</p>
                )}
            </div>
        </div>
    );
};

export default PublicProfile;