// src/frontend/components/dashboard/AdCardSkeleton.js
import React from 'react';
import '../../styles/AdCardSkeleton.css'; // We will replace the styles in the next step

const AdCardSkeleton = () => {
    return (
        <div className="ad-card-skeleton">
            {/* The image area will now have the shimmer effect */}
            <div className="skeleton shimmer-image"></div>
            <div className="skeleton-details">
                {/* Text placeholders */}
                <div className="skeleton shimmer-line title"></div>
                <div className="skeleton shimmer-line price"></div>
                <div className="skeleton-specs">
                    <div className="skeleton shimmer-line spec"></div>
                    <div className="skeleton shimmer-line spec"></div>
                    <div className="skeleton shimmer-line spec"></div>
                    <div className="skeleton shimmer-line spec"></div>
                    <div className="skeleton shimmer-line spec"></div>
                    <div className="skeleton shimmer-line spec"></div>
                </div>
            </div>
        </div>
    );
};

export default AdCardSkeleton;