// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FeaturedCarousel from './FeaturedCarousel';
import AdCard from './dashboard/AdCard';
import AdCardSkeleton from './dashboard/AdCardSkeleton'; // 1. Import the skeleton
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';
import { useAds } from '../context/AdContext'; // 1. Import the context hook
import { ChevronDown } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { country } = useLocation();

    const activeFilter = searchParams.get('type') || 'cars';
    const sortOrder = searchParams.get('sort') || 'newest-first';
    const currentQuery = searchParams.get('q') || '';

    const [advancedFilters, setAdvancedFilters] = useState({});

    // 2. Add loading state to the homepage
    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState(null); // Add error state
    const { getPublicAds, searchAds } = useAds(); // 2. Get the function from context

    // This useEffect hook is now the "engine". It depends on activeFilter.
    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            const params = {
                geo_location: country.name,
                sort_by: sortOrder,
                type: activeFilter === 'cars' ? 'car' : 'real_estate',
                ...advancedFilters, // Add the advanced filters here
            };
            try {
                let data;
                // --- EDIT: Decide whether to search or list ---
                if (currentQuery) {
                    params.q = currentQuery;
                    data = await searchAds(params);
                } else {
                    data = await getPublicAds(params);
                }
                setAds(data || []); // Ensure ads is always an array
            } catch (err) {
                let errorMessage = 'Failed to load advertisements.';
                if (err.response && err.response.status === 422) {
                    errorMessage = 'Invalid filters provided. Please check your search criteria.';
                    console.error('Validation Errors:', err.response.data.errors);
                } else {
                    errorMessage = err.message || errorMessage;
                    setError(err.message || 'Failed to load advertisements.');
                    setAds([]); // Clear ads on error
                }

            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [country, activeFilter, sortOrder, advancedFilters, getPublicAds, searchAds, currentQuery]); // 3. Re-run this effect WHENEVER activeFilter changes.

    const handleFilterChange = (filter) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('q'); // CRITICAL: Clear the search query when changing tabs
        newParams.set('type', filter);
        setSearchParams(newParams);
    };

    // This handler receives the new filter from the child and updates the state.
    const handleSortChange = (sort) => {
        setSearchParams(prevParams => {
            prevParams.set('sort', sort);
            return prevParams;
        }, { replace: true });
    };

    const handleSearchApply = (appliedFilters) => {
        console.log("Applying advanced filters:", appliedFilters);
        setAdvancedFilters(appliedFilters);
        // You could also add these to the URL if you want them to be persistent
    };

    // --- EDIT: This function is called by the SearchFilters component ---
    const handleSearch = (query) => {
        const newParams = new URLSearchParams(searchParams); // Start fresh
        newParams.set('q', query);
        // You can add other filters here if you want to preserve them during search
        setSearchParams(newParams);
    };

    return (
        <div className="home-page-container">
            <FeaturedCarousel />

            <SearchFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onSearchApply={handleSearchApply}
                currentFilters={advancedFilters}
                onSearch={handleSearch}
            />
            <div className="list-header">
                <h1>أحدث الإعلانات</h1>
                <div className="sort-dropdown-wrapper">
                    <select
                        className="sort-dropdown"
                        value={sortOrder}
                        onChange={(e) => handleSortChange(e.target.value)}
                    >
                        <option value="newest-first">الأحدث أولاً</option>
                        <option value="oldest-first">الأقدم أولاً</option>
                        <option value="price-asc">السعر: من الأرخص للأغلى</option>
                        <option value="price-desc">السعر: من الأغلى للأرخص</option>
                    </select>
                    <ChevronDown size={20} className="sort-dropdown-icon" />
                </div>
            </div>

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