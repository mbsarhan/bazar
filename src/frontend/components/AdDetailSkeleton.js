// src/frontend/components/AdDetailSkeleton.js
import React from 'react';
import '../styles/AdDetailSkeleton.css'; // New CSS file for this skeleton

const AdDetailSkeleton = () => {
    return (
        <div className="ad-detail-skeleton-container">
            <div className="skeleton-header">
                <div className="skeleton shimmer-line full"></div>
                <div className="skeleton shimmer-line medium"></div>
            </div>
            <div className="skeleton-content">
                <div className="skeleton shimmer-image large"></div>
                <div className="skeleton-info">
                    <div className="skeleton shimmer-line small"></div>
                    <div className="skeleton shimmer-line"></div>
                    <div className="skeleton shimmer-line"></div>
                    <div className="skeleton shimmer-line"></div>
                    <div className="skeleton shimmer-line short"></div>
                    
                    <div className="skeleton shimmer-line small second-header"></div>
                    <div className="skeleton shimmer-line"></div>
                    <div className="skeleton shimmer-line"></div>
                </div>
            </div>
        </div>
    );
};

export default AdDetailSkeleton;