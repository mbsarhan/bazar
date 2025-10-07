// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { carAdsData, realEstateAdsData } from './dashboard/mockData';
import AdCard from './dashboard/AdCard'; 
import AdCardSkeleton from './dashboard/AdCardSkeleton'; // 1. Import the skeleton
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';

const HomePage = () => {
    // 2. Add loading state to the homepage
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);

    // 3. Use useEffect to simulate fetching ads
    useEffect(() => {
        // This function will fetch your ads from the API
        const fetchAds = () => {
            setIsLoading(true);
            
            // --- API Call Simulation ---
            // In a real app: const response = await axios.get('/api/ads?status=active');
            const allAds = [...carAdsData, ...realEstateAdsData]
                .filter(ad => ad.status === 'فعال')
                .sort((a, b) => b.id - a.id);
            
            // Simulate a network delay to see the loading effect
            setTimeout(() => {
                setAds(allAds);
                setIsLoading(false);
            }, 1000); // 1 second delay
        };

        fetchAds();
    }, []); // Empty array means this runs once on mount

    return (
        <div className="home-page-container">
            <SearchFilters />

            <h1>أحدث الإعلانات</h1>
            <div className="ads-list-container">
                {isLoading ? (
                    // 4. If loading, show a grid of 8 skeleton cards
                    Array.from({ length: 8 }).map((_, index) => (
                        <AdCardSkeleton key={index} />
                    ))
                ) : (
                    // 5. When done, show the real ad cards
                    ads.map(ad => (
                        <AdCard key={ad.id} ad={ad} isPublic={true} />
                    ))
                )}
            </div>
        </div>
    );
};

export default HomePage;