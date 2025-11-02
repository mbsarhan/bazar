// src/frontend/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation as useReactRouterLocation } from 'react-router-dom';
import FeaturedCarousel from './FeaturedCarousel';
import AdCard from './dashboard/AdCard';
import AdCardSkeleton from './dashboard/AdCardSkeleton';
import SearchFilters from './SearchFilters';
import '../styles/HomePage.css';
import { useAds } from '../context/AdContext';
import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Mail, MessageSquare, Phone } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

const HomePage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { country } = useLocation();

    // 2. Read all relevant parameters from the URL
    const activeFilter = searchParams.get('type') || 'cars';
    const sortOrder = searchParams.get('sort') || 'newest-first';
    const currentQuery = searchParams.get('query') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10); // Current page from URL

    const [advancedFilters, setAdvancedFilters] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [ads, setAds] = useState([]);
    const [error, setError] = useState(null);
    const { getPublicAds, searchAds } = useAds();

    const reactRouterLocation = useReactRouterLocation();

    // 3. Add state for total pages
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);

            // 1. Combine all necessary parameters: location, sorting, type, advanced filters, and pagination
            const params = {
                geo_location: country.name,
                sort_by: sortOrder,
                type: activeFilter === 'cars' ? 'car' : 'real_estate',
                // Keep the existing derived advancedFilters (from HomePage.js state/URL)
                ...advancedFilters,

                // Add the new pagination parameters (from the incoming 'main' branch logic)
                // Note: If you don't have currentPage/setTotalPages state yet, you'll need to add them!
                page: currentPage,
                limit: 24,
            };

            try {
                let data;
                let response; // Use a variable to hold the full response object

                // 2. Incorporate your search/list decision logic
                if (currentQuery) {
                    // Use 'q' for query if that's what your backend expects, not 'params.query'
                    params.query = currentQuery;
                    response = await searchAds(params);
                } else {
                    response = await getPublicAds(params);
                }

                // 3. Process the response: Assumes the API now returns { data: adsArray, totalPages: number }
                setAds(response.data || []);
                setTotalPages(response.totalPages || 1); // Set total pages for pagination UI
            } catch (err) {
                // ... error handling logic remains here ...
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
        // 6. Add `currentPage` to the dependency array
    }, [country,
        activeFilter,
        sortOrder,
        advancedFilters,
        currentPage, // Keep the pagination dependency
        getPublicAds,
        searchAds,
        currentQuery]);

    const handleFilterChange = (filter) => {
        setSearchParams(prevParams => {
            
            // 1. Set the new filter type (from both versions)
            prevParams.set('type', filter);
            
            // 2. Clear the search query (from HEAD version)
            prevParams.delete('query'); // Assuming 'q' is the query param, not 'query'
            
            // 3. Reset pagination to page 1 (from main version)
            prevParams.set('page', '1'); 
            
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

    const handleSearch = (query) => {
        const newParams = new URLSearchParams(searchParams); // Start fresh
        newParams.set('query', query); 
        newParams.set('page', '1'); // IMPORTANT: Reset to page 1 on a new search
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

            <div className="contact-us-section">
                <div className="contact-us-content">
                    <div className="contact-us-icon-wrapper">
                        <MessageCircle size={48} className="contact-icon" />
                    </div>
                    <h2>هل لديك أي استفسار؟</h2>
                    <p>نحن هنا لمساعدتك! تواصل معنا في أي وقت</p>
                    <div className="contact-buttons">
                        <a href="mailto:support@diyalha.com" className="contact-btn email-btn">
                            <Mail size={20} />
                            <span>البريد الإلكتروني</span>
                        </a>
                        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="contact-btn whatsapp-btn">
                            <MessageSquare size={20} />
                            <span>واتساب</span>
                        </a>
                        <a href="tel:+1234567890" className="contact-btn phone-btn">
                            <Phone size={20} />
                            <span>اتصل بنا</span>
                        </a>
                    </div>
                </div>
                <div className="contact-decorative-circles">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;