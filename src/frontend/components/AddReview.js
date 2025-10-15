// src/frontend/components/AddReview.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // 1. IMPORT
import StarInput from './StarInput'; // Our new interactive star component
import '../styles/forms.css';
import '../styles/AddReview.css'; // New CSS for this page

const AddReview = () => {
    const navigate = useNavigate();
    const { userIdToReview } = useParams(); // Get the ID of the user we are reviewing from the URL
    const { rateUser } = useUser    (); // 2. GET THE FUNCTION

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (rating === 0) {
            setError('يرجى تحديد تقييم (نجمة واحدة على الأقل).');
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare the data in the format the backend expects
            const ratingData = {
                rated_user_id: parseInt(userIdToReview),
                rating: rating,
                message: comment,
            };

            // Call the context function
            const result = await rateUser(ratingData);

            alert('شكراً لك، تم إرسال تقييمك بنجاح!');
            // Navigate back to the profile page you were just on
            navigate(`/profile/${userIdToReview}`);

        } catch (err) {
            setError(err.response?.data?.message || 'فشل إرسال التقييم.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="centered-page-container">
            <div className="form-container">
                <h2>إضافة تقييم</h2>
                <p className="form-subtitle">قم بتقييم تجربتك مع المستخدم.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>تقييمك</label>
                        {/* --- The New Interactive Star Component --- */}
                        <StarInput 
                            rating={rating}
                            onRatingChange={setRating}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">تعليقك</label>
                        <textarea 
                            id="comment" 
                            rows="5"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="صف تجربتك هنا..."
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReview;