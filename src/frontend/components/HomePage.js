// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation as useReactRouterLocation } from 'react-router-dom';
import FeaturedCarousel from './FeaturedCarousel';
import AdCard from './dashboard/AdCard';
import AdCardSkeleton from './dashboard/AdCardSkeleton';
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';
import { useAds } from '../context/AdContext';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'; // 1. Import new icons
import { useLocation } from '../context/LocationContext';

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { country } = useLocation();

    // 2. Read all relevant parameters from the URL
    const activeFilter = searchParams.get('type') || 'cars';
    const sortOrder = searchParams.get('sort') || 'newest-first';
    const currentPage = parseInt(searchParams.get('page') || '1', 10); // Current page from URL

    const [advancedFilters, setAdvancedFilters] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState(null);
    const { getPublicAds } = useAds();

    const reactRouterLocation = useReactRouterLocation();

    // 3. Add state for total pages
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // 4. Add pagination parameters to the API call
                const params = {
                    geo_location: country.name,
                    sort_by: sortOrder,
                    type: activeFilter === 'cars' ? 'car' : 'real_estate',
                    page: currentPage, // Send the current page number
                    limit: 24,         // Send the number of ads per page
                    ...advancedFilters,
                };

                // 5. The API response now needs to be an object with ad data and total pages
                const response = await getPublicAds(params);
                setAds(response.data);
                setTotalPages(response.totalPages);

            } catch (err) {
                console.error("Failed to fetch public ads:", err);
                setError(err.message || 'Failed to load advertisements.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
        // 6. Add `currentPage` to the dependency array
    }, [country, activeFilter, sortOrder, advancedFilters, currentPage, getPublicAds]);

    const handleFilterChange = (filter) => {
        setSearchParams(prevParams => {
            prevParams.set('type', filter);
            prevParams.set('page', '1'); // Reset to page 1 when filters change
            return prevParams;
        }, { replace: true });
    };

    const handleSortChange = (sort) => {
        setSearchParams(prevParams => {
            prevParams.set('sort', sort);
            prevParams.set('page', '1'); // Reset to page 1 when sorting changes
            return prevParams;
        }, { replace: true });
    };

    const handleSearchApply = (appliedFilters) => {
        setAdvancedFilters(appliedFilters);
        setSearchParams(prevParams => {
            // This merges new filters into the URL but you can customize this
            Object.keys(appliedFilters).forEach(key => {
                prevParams.set(key, appliedFilters[key]);
            });
            prevParams.set('page', '1'); // Always reset to page 1 on a new search
            return prevParams;
        }, { replace: true });
    };

    // 7. Handler to change the page
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // Prevent going out of bounds
        setSearchParams(prevParams => {
            prevParams.set('page', newPage.toString());
            return prevParams;
        }, { replace: true });
        window.scrollTo(0, 0); // Scroll to top on page change
    };


    return (
        <div className="home-page-container">
            <FeaturedCarousel />

            <SearchFilters
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onSearchApply={handleSearchApply}
                currentFilters={advancedFilters}
            />
            <div className="list-header">
                <h1>أحدث الإعلانات</h1>
                <div className="sort-dropdown-wrapper">
                    <select className="sort-dropdown" value={sortOrder} onChange={(e) => handleSortChange(e.target.value)}>
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
                    Array.from({ length: 8 }).map((_, index) => <AdCardSkeleton key={index} />)
                ) : error ? (
                    <p className="error-message">حدث خطأ أثناء تحميل الإعلانات: {error}</p>
                ) : ads.length > 0 ? (
                    (() => {
                        const filteredAdIds = ads.map(ad => ad.id);

                        const returnPath = reactRouterLocation.pathname + reactRouterLocation.search;

                        return ads.map(ad => (
                            <AdCard
                                key={ad.id} ad={ad}
                                isPublic={true}
                                adIdList={filteredAdIds}
                                returnPath={returnPath}
                            />
                        ));
                    })()
                ) : (
                    <p>لا توجد إعلانات لعرضها حالياً تطابق بحثك.</p>
                )}
            </div>

            {/* 8. Add Pagination Controls */}
            {!isLoading && totalPages > 1 && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                        <ChevronRight size={18} />
                        <span>السابق</span>
                    </button>
                    <span className="page-info">
                        صفحة {currentPage} من {totalPages}
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                        <span>التالي</span>
                        <ChevronLeft size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;