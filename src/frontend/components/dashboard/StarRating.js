// src/frontend/components/dashboard/StarRating.js
import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, size = 20 }) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="star-rating">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full_${i}`} size={size} fill="#FFD700" strokeWidth={0} />
            ))}
            {halfStar && (
                <div className="half-star" style={{ width: `${size}px`, height: `${size}px` }}>
                    <Star size={size} fill="#FFD700" strokeWidth={0} />
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty_${i}`} size={size} fill="#e4e5e9" strokeWidth={0} />
            ))}
        </div>
    );
};

export default StarRating;