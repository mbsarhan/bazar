// src/frontend/components/dashboard/Reviews.js
import React from 'react';
import StarRating from './StarRating';
import { userReviewsData } from './mockData';
import '../../styles/Reviews.css'; // New CSS file for this page

const Reviews = () => {
    const { averageRating, totalReviews, reviews } = userReviewsData;

    return (
        <div className="reviews-page-wrapper">
            <div className="content-header">
                <h1>تقييماتي</h1>
            </div>

            {/* --- Average Rating Summary --- */}
            <div className="average-rating-summary">
                <div className="average-rating-header">
                    <h2>التقييم الإجمالي</h2>
                    <p>بناءً على {totalReviews} مراجعات</p>
                </div>
                <div className="average-rating-display">
                    <span className="average-rating-number">{averageRating.toFixed(1)}</span>
                    <StarRating rating={averageRating} size={28} />
                </div>
            </div>

            {/* --- List of Individual Reviews --- */}
            <div className="reviews-list">
                {reviews.map(review => (
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
    );
};

export default Reviews;