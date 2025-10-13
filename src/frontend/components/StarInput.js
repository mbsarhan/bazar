// src/frontend/components/StarInput.js
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarInput = ({ rating, onRatingChange }) => {
    // A temporary state to handle the hover effect
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="star-input-container">
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <Star
                        key={starValue}
                        size={32}
                        // The star is filled if its value is less than or equal to the hover or selected rating
                        fill={(hoverRating || rating) >= starValue ? "#FFD700" : "#e4e5e9"}
                        strokeWidth={0}
                        onClick={() => onRatingChange(starValue)}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                    />
                );
            })}
        </div>
    );
};

export default StarInput;