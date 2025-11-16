import React from 'react';
import '../styles/AdDetailPage.css'; 
import '../styles/AdDetailSkeleton.css';

const AdDetailSkeleton = () => {
    return (
        <div className="ad-detail-container">
            <div className="ad-detail-grid">
                {/* Left Column */}
                <div className="ad-gallery-section">
                    <div className="skeleton main-image-skeleton"></div>
                    <div className="thumbnails-grid">
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                    </div>
                </div>
                {/* Right Column */}
                <div className="ad-details-section">
                    <div className="detail-card">
                        <div className="skeleton skeleton-line stats-line"></div>
                        <div className="skeleton skeleton-line title-line"></div>
                        <div className="skeleton skeleton-line title-line short"></div>
                        <div className="skeleton skeleton-line price-line"></div>
                    </div>
                    <div className="detail-card">
                        <div className="skeleton skeleton-line spec-title"></div>
                        <div className="specs-grid">
                            <div className="skeleton spec-item-skeleton"></div>
                            <div className="skeleton spec-item-skeleton"></div>
                            <div className="skeleton spec-item-skeleton"></div>
                            <div className="skeleton spec-item-skeleton"></div>
                            <div className="skeleton spec-item-skeleton"></div>
                            <div className="skeleton spec-item-skeleton"></div>
                        </div>
                    </div>
                    <div className="detail-card">
                        <div className="skeleton skeleton-line spec-title"></div>
                        <div className="skeleton skeleton-line"></div>
                        <div className="skeleton skeleton-line"></div>
                        <div className="skeleton skeleton-line w-75"></div>
                    </div>
                    <div className="detail-card">
                        <div className="skeleton skeleton-line spec-title"></div>
                        <div className="skeleton-seller-info">
                            <div className="skeleton skeleton-circle"></div>
                            <div className="skeleton-seller-details">
                                <div className="skeleton skeleton-line"></div>
                                <div className="skeleton skeleton-line w-50"></div>
                            </div>
                        </div>
                        <div className="skeleton-contact-buttons">
                            <div className="skeleton skeleton-button"></div>
                            <div className="skeleton skeleton-button"></div>
                        </div>
                    </div>
                </div>
                {/* Navigation Bar */}
                <div className="ad-navigation-bar">
                    <div className="skeleton nav-button-skeleton"></div>
                    <div className="skeleton home-button-skeleton"></div>
                    <div className="skeleton nav-button-skeleton"></div>
                </div>
            </div>
        </div>
    );
};
export default AdDetailSkeleton;