// src/frontend/components/PublicProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAds } from '../context/AdContext'; // We'll need a new function here
import StarRating from './dashboard/StarRating';
import AdCard from './dashboard/AdCard';
import '../styles/PublicProfile.css'; // New CSS file

// Mock data until the API is ready
import { userReviewsData } from './dashboard/mockData';
import { carAdsData, realEstateAdsData } from './dashboard/mockData';

const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    // const { getUserPublicProfile } = useAds(); // We will use this in the future

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                // --- API Call Simulation ---
                // In a real app:
                // const data = await getUserPublicProfile(userId);
                
                // For now, we simulate finding the user and their data
                await new Promise(resolve => setTimeout(resolve, 500));
                const fakeProfileData = {
                    user: {
                        id: userId,
                        name: 'عاطف غياض', // Example name
                        memberSince: 'سبتمبر 2025',
                    },
                    reviews: userReviewsData,
                    ads: [...carAdsData, ...realEstateAdsData].filter(ad => ad.status === 'فعال'),
                };
                setProfileData(fakeProfileData);

            } catch (err) {
                setError("لا يمكن تحميل الملف الشخصي للمستخدم.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);


    if (isLoading) {
        // We can create a dedicated skeleton for this page later
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
                    {/* Placeholder for a user profile picture */}
                    <span>{profileData.user.name.charAt(0)}</span>
                </div>
                <div className="profile-header-info">
                    <h1>{profileData.user.name}</h1>
                    <p>عضو منذ {profileData.user.memberSince}</p>
                    <div className="profile-header-rating">
                        <StarRating rating={profileData.reviews.averageRating} size={24} />
                        <span>{profileData.reviews.averageRating.toFixed(1)}</span>
                        <span>({profileData.reviews.totalReviews} تقييمات)</span>
                    </div>
                </div>
                <div className="add-review-button-wrapper">
                    <button 
                        className="submit-btn add-review-btn" 
                        onClick={() => navigate(`/add-review/${userId}`)}
                    >
                        + أضف تقييمك
                    </button>
                </div>
            </div>

            {/* --- Active Ads Section --- */}
            <div className="profile-section">
                <h2>الإعلانات النشطة ({profileData.ads.length})</h2>
                <div className="ads-list-container">
                    {profileData.ads.map(ad => (
                        <AdCard key={ad.id} ad={ad} isPublic={true} />
                    ))}
                </div>
            </div>
            
            {/* --- Reviews Section --- */}
            <div className="profile-section">
                <h2>التقييمات</h2>
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
            </div>
        </div>
    );
};

export default PublicProfile;