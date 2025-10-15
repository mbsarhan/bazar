// src/frontend/components/PublicProfile.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // 1. IMPORT
import { useAuth } from '../context/AuthContext'; // 2. IMPORT AuthContext
import { useAds } from '../context/AdContext'; // We'll need a new function here
import StarRating from './dashboard/StarRating';
import AdCard from './dashboard/AdCard';
import '../styles/PublicProfile.css'; // New CSS file


const PublicProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { getPublicProfile } = useUser(); // 2. GET THE FUNCTION
    const { user: loggedInUser } = useAuth(); // 3. Get the currently logged-in user
    // const { getUserPublicProfile } = useAds(); // We will use this in the future

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. REPLACE MOCK LOGIC with the real API call
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPublicProfile(userId);
                setProfileData(data);
            } catch (err) {
                // Get the error message from the API response
                const errorMessage = err.response?.data?.message || 'لا يمكن تحميل الملف الشخصي للمستخدم.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [userId, getPublicProfile]);

    // --- 4. THE NEW HANDLER FOR THE "ADD REVIEW" BUTTON ---
    const handleAddReviewClick = () => {
        if (loggedInUser) {
            // If the user is logged in, navigate to the review page
            navigate(`/add-review/${userId}`);
        } else {
            // If the user is a guest, navigate to the login page
            // We pass the current path in the state to redirect back after login
            navigate('/login', { state: { from: `/profile/${userId}` } });
        }
    };


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
                    {/* 
                      * 5. The button now calls our new handler.
                      * We also add a condition to hide the button if the user is viewing their own profile.
                    */}
                    {loggedInUser?.id !== parseInt(userId) && (
                         <button 
                            className="submit-btn add-review-btn" 
                            onClick={handleAddReviewClick}
                        >
                            + أضف تقييمك
                        </button>
                    )}
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