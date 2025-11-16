// src/frontend/components/AdDetailSkeleton.js - Final Version
import React from 'react';
// We will reuse the main detail page CSS for layout and create a new one for skeleton specifics
import '../styles/AdDetailPage.css'; 
import '../styles/AdDetailSkeleton.css';

const AdDetailSkeleton = () => {
    return (
        <div className="ad-detail-container">
            <div className="ad-detail-grid">
                {/* --- Left Column: Gallery Skeleton --- */}
                <div className="ad-gallery-section">
                    {/* Main Image */}
                    <div className="skeleton main-image-skeleton"></div>
                    
                    {/* Thumbnails */}
                    <div className="thumbnails-grid">
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                        <div className="skeleton thumbnail-skeleton"></div>
                    </div>
                </div>

                {/* --- Right Column: Details Skeleton --- */}
                <div className="ad-details-section">
                    {/* Header Card Skeleton */}
                    <div className="detail-card">
                        <div className="skeleton-header-card">
                            <div className="skeleton skeleton-line stats-line"></div>
                            <div className="skeleton skeleton-line title-line"></div>
                            <div className="skeleton skeleton-line title-line short"></div>
                            <div className="skeleton skeleton-line price-line"></div>
                        </div>
                    </div>

                    {/* Specs Card Skeleton */}
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

                    {/* Description Card Skeleton */}
                    <div className="detail-card">
                        <div className="skeleton skeleton-line spec-title"></div>
                        <div className="skeleton skeleton-line"></div>
                        <div className="skeleton skeleton-line"></div>
                        <div className="skeleton skeleton-line w-75"></div>
                    </div>

                    {/* Seller Card Skeleton */}
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

                {/* --- Navigation Bar Skeleton --- */}
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