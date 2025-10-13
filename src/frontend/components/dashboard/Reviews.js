// src/frontend/components/dashboard/Reviews.js
import React ,{ useState, useEffect }from 'react';
import StarRating from './StarRating';
//import { userReviewsData } from './mockData';
import '../../styles/Reviews.css'; // New CSS file for this page
import { useUser } from '../../context/UserContext'; // 1. IMPORT

const Reviews = () => {
    // 2. SETUP STATE for data, loading, and errors
    const [reviewData, setReviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState(null);
    const { getUserReviews }        = useUser(); // 3. GET THE FUNCTION

    // 4. FETCH DATA on component mount
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setIsLoading(true);
                const data = await getUserReviews();
                console.log("Fetching...");
                setReviewData(data);
            } catch (err) {
                setError(err.message || 'Failed to load reviews.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, [getUserReviews]);


    // 5. RENDER based on state
    if (isLoading) {
        return <p>جاري تحميل التقييمات...</p>; // Or a skeleton loader
    }
    
    if (error) {
        return <p className="error-message">حدث خطأ: {error}</p>;
    }

    // This check is important for when the API call succeeds but there's no data
    if (!reviewData) {
        return <p>لا توجد بيانات تقييم لعرضها.</p>;
    }


    const { averageRating, totalReviews, reviews } = reviewData ;

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
                    <span className="average-rating-number">{parseFloat(averageRating).toFixed(1)}</span>
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