// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import AdCard from './dashboard/AdCard'; 
import AdCardSkeleton from './dashboard/AdCardSkeleton'; // 1. Import the skeleton
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';
import { useAds } from '../context/AdContext'; // 1. Import the context hook

const HomePage = () => {

    const [activeFilter, setActiveFilter] = useState('all');

    // 2. Add loading state to the homepage
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState(null); // Add error state
    const { getPublicAds } = useAds(); // 2. Get the function from context

     // This useEffect hook is now the "engine". It depends on activeFilter.
    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 1. Build the filters object based on the current activeFilter.
                const filters = {};
                if (activeFilter !== 'all') {
                    // Map 'cars' to 'car' and 'real-estate' to 'real_estate' for the API
                    const apiType = activeFilter === 'cars' ? 'car' : 'real_estate';
                    filters.type = apiType;
                }
                
                // 2. Pass the filters to the API call.
                const data = await getPublicAds(filters);
                setAds(data);
            } catch (err) {
                console.error("Failed to fetch public ads:", err);
                setError(err.message || 'Failed to load advertisements.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [activeFilter, getPublicAds]); // 3. Re-run this effect WHENEVER activeFilter changes.

    // This handler receives the new filter from the child and updates the state.
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <div className="home-page-container">
            <SearchFilters onFilterChange={handleFilterChange}/>

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