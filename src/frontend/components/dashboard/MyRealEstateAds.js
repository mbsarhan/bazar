// src/frontend/components/dashboard/MyRealEstateAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import AdCardSkeleton from './AdCardSkeleton';
import { useAds } from '../../context/AdContext';
// We are not using the context for now, so the import can be removed if you wish

const MyRealEstateAds = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getMyRealEstateAds } = useAds();


    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getMyRealEstateAds();
                setAds(data);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching ads.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [getMyRealEstateAds]); // Runs once on mount

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
                ) : error ? (
                    <p className="error-message">خطأ في تحميل الإعلانات: {error}</p>
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