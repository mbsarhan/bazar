// src/frontend/components/AddReview.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StarInput from './StarInput'; // Our new interactive star component
import '../styles/forms.css';
import '../styles/AddReview.css'; // New CSS for this page

const AddReview = () => {
    const navigate = useNavigate();
    const { userIdToReview } = useParams(); // Get the ID of the user we are reviewing from the URL

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
            // --- API Call Simulation ---
            // In a real app:
            // await api.post(`/users/${userIdToReview}/reviews`, { rating, comment });
            
            console.log("Submitting Review:", { rating, comment, userIdToReview });
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('شكراً لك، تم إرسال تقييمك بنجاح!');
            navigate('/'); // Navigate back to the dashboard

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