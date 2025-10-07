// src/frontend/components/dashboard/MyRealEstateAds.js
import React, { useState, useEffect } from 'react';
import { realEstateAdsData } from './mockData'; // 1. Use mockData import
import AdCard from './AdCard';
import AdCardSkeleton from './AdCardSkeleton';
// We are not using the context for now, so the import can be removed if you wish

const MyRealEstateAds = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // No need for error state when using mock data
    // No need for delete modal state yet

    useEffect(() => {
        const fetchMockAds = () => {
            setIsLoading(true);

            // --- THIS IS THE CHANGE ---
            // We are now using the imported realEstateAdsData directly
            
            // Simulate a network delay to see the loading effect
            setTimeout(() => {
                setAds(realEstateAdsData);
                setIsLoading(false);
            }, 1000); // 1-second delay
        };

        fetchMockAds();
    }, []); // Runs once on mount

    return (
        <div>
            <div className="content-header">
                <h1>إعلاناتي للعقارات</h1>
            </div>
            <div className="ads-list-container">
                {isLoading ? (
                    // If loading, render the skeletons
                    Array.from({ length: 4 }).map((_, index) => (
                        <AdCardSkeleton key={index} />
                    ))
                ) : ads.length > 0 ? (
                    // If not loading and ads exist, render the real ads
                    ads.map(ad => (
                        <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            // The onDelete prop is removed for now
                        />
                    ))
                ) : (
                    // If not loading and no ads exist, render the "no ads" message
                    <p>ليس لديك أي إعلانات عقارات منشورة حالياً.</p>
                )}
            </div>
            {/* The delete modal is removed for now */}
        </div>
    );
};

export default MyRealEstateAds;