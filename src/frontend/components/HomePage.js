// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import AdCard from './dashboard/AdCard'; 
import AdCardSkeleton from './dashboard/AdCardSkeleton'; // 1. Import the skeleton
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';
import { useAds } from '../context/AdContext'; // 1. Import the context hook

const HomePage = () => {
    // 2. Add loading state to the homepage
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState(null); // Add error state
    const { getPublicAds } = useAds(); // 2. Get the function from context

     // 3. Replace mock data logic with the real API call
    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getPublicAds();
                setAds(data);
            } catch (err) {
                console.error("Failed to fetch public ads:", err);
                setError(err.message || 'Failed to load advertisements.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [getPublicAds]); // Dependency array is correct
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
                ) : error ? (
                    <p className="error-message">حدث خطأ أثناء تحميل الإعلانات: {error}</p>
                ) : ads.length > 0 ? (
                    ads.map(ad => (
                        <AdCard key={ad.id} ad={ad} isPublic={true} />
                    ))
                ) : (
                    <p>لا توجد إعلانات لعرضها حالياً.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;