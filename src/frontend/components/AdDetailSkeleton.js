// src/frontend/components/AdDetailSkeleton.js
import React from 'react';
import '../styles/AdDetailSkeleton.css';

const AdDetailSkeleton = () => {
    return (
        <div className="ad-detail-skeleton-container">
            {/* --- Skeleton for the Header --- */}
            <div className="skeleton-header">
                <div className="skeleton shimmer-line full"></div>
                <div className="skeleton shimmer-line medium"></div>
            </div>

            {/* --- Skeleton for the Main Content (column layout) --- */}
            <div className="skeleton-main-content">
                {/* --- Skeleton for the Image Gallery --- */}
                <div className="skeleton-image-gallery">
                    <div className="skeleton shimmer-image large"></div>
                    
                    {/* --- Skeleton for the Thumbnail Bar --- */}
                    <div className="skeleton-thumbnail-wrapper">
                        {/* Video Thumbnail Placeholder */}
                        <div className="skeleton shimmer-video-thumb"></div>
                        
                        {/* Photo Thumbnail Placeholders */}
                        <div className="skeleton-thumb-scroller">
                            <div className="skeleton shimmer-thumb"></div>
                            <div className="skeleton shimmer-thumb"></div>
                            <div className="skeleton shimmer-thumb"></div>
                            <div className="skeleton shimmer-thumb"></div>
                            <div className="skeleton shimmer-thumb"></div>
                        </div>
                    </div>
                </div>

                {/* --- Skeleton for the Ad Info Section --- */}
                <div className="skeleton-info-section">
                    <div className="skeleton shimmer-line small"></div>
                    <div className="skeleton-info-grid">
                        <div className="skeleton shimmer-info-item"></div>
                        <div className="skeleton shimmer-info-item"></div>
                        <div className="skeleton shimmer-info-item"></div>
                    </div>
                    <div className="skeleton shimmer-line small second-header"></div>
                    <div className="skeleton shimmer-line long-text"></div>
                    <div className="skeleton shimmer-line long-text"></div>
                    <div className="skeleton shimmer-line long-text short"></div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailSkeleton;