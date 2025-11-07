// src/frontend/components/SearchFilters.js
import React, { useState, useEffect } from 'react';
// 1. Import the X icon
import { SlidersHorizontal, Search, Car, Home, X, RotateCcw } from 'lucide-react';
import Slider from 'rc-slider';
import Modal from './dashboard/Modal';
import { useLocation } from '../context/LocationContext';
import { locationData } from '../context/locationData';
import '../styles/SearchFilters.css';

// ... (The CarFilters and RealEstateFilters components remain exactly the same)
const formatPrice = (val) => `$${val.toLocaleString('en-US')}`;

const CarFilters = ({ filters, onFilterChange, provinces, onReset }) => {
    // ... no changes here
    const MIN = 0;
    const MAX = 300000;

    const priceRange = filters.priceRange || [MIN, MAX];
    const leftPercent = ((priceRange[0] - MIN) / (MAX - MIN)) * 100;
    const rightPercent = ((priceRange[1] - MIN) / (MAX - MIN)) * 100;
    const areLabelsClose = (priceRange[1] - priceRange[0]) < (MAX - MIN) * 0.18;

    return (
        <div className="modal-filters-grid">
            <div className="filter-item">
                <label>المحافظة</label>
                <select
                    value={filters.governorate || ''}
                    onChange={e => onFilterChange('governorate', e.target.value)}
                >
                    <option value="">كل المحافظات</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="filter-item">
                <label>الحالة</label>
                <select value={filters.condition || ''} onChange={e => onFilterChange('condition', e.target.value)}>
                    <option value="">الكل</option>
                    <option value="جديد">جديدة</option>
                    <option value="مستعملة">مستعملة</option>
                    <option value="متضررة">متضررة</option>
                </select>
            </div>
            <div className="filter-item filter-item-full">
                <label>نطاق السعر (دولار أمريكي)</label>
                <div className="range-slider-wrapper">
                    <Slider
                        range min={MIN} max={MAX} step={500}
                        value={priceRange}
                        onChange={newRange => onFilterChange('priceRange', newRange)}
                        allowCross={false}
                    />
                    <div className={`range-labels ${areLabelsClose ? 'labels-are-close' : ''}`}>
                        <span className="range-label-min" style={{ left: `${leftPercent}%` }}>
                            {formatPrice(priceRange[0])}
                        </span>
                        <span className="range-label-max" style={{ left: `${rightPercent}%` }}>
                            {formatPrice(priceRange[1])}
                        </span>
                    </div>
                </div>
            </div>

            <div className="filter-item filter-item-full">
                <button onClick={onReset} className="reset-filters-btn">
                    <RotateCcw size={16} />
                    <span>العودة للافتراضي</span>
                </button>
            </div>
        </div>
    );
};
const RealEstateFilters = ({ filters, onFilterChange, provinces, onReset }) => {
    // ... no changes here
    const MIN = 0;
    const MAX = 1000000;

    const priceRange = filters.priceRange || [MIN, MAX];
    const leftPercent = ((priceRange[0] - MIN) / (MAX - MIN)) * 100;
    const rightPercent = ((priceRange[1] - MIN) / (MAX - MIN)) * 100;
    const areLabelsClose = (priceRange[1] - priceRange[0]) < (MAX - MIN) * 0.20;

    return (
        <div className="modal-filters-grid">
            <div className="filter-item">
                <label>المحافظة</label>
                <select
                    value={filters.governorate || ''}
                    onChange={e => onFilterChange('governorate', e.target.value)}
                >
                    <option value="">كل المحافظات</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="filter-item">
                <label>نوع العقار</label>
                <select value={filters.realestate_type || ''} onChange={e => onFilterChange('realestate_type', e.target.value)}>
                    <option value="">الكل</option>
                    <option value="شقة">شقة</option>
                    <option value="فيلا">فيلا</option>
                </select>
            </div>
            <div className="filter-item filter-item-full">
                <label>نطاق السعر (دولار أمريكي)</label>
                <div className="range-slider-wrapper">
                    <Slider
                        range min={MIN} max={MAX} step={1000}
                        value={priceRange}
                        onChange={newRange => onFilterChange('priceRange', newRange)}
                        allowCross={false}
                    />
                    <div className={`range-labels ${areLabelsClose ? 'labels-are-close' : ''}`}>
                        <span className="range-label-min" style={{ left: `${leftPercent}%` }}>
                            {formatPrice(priceRange[0])}
                        </span>
                        <span className="range-label-max" style={{ left: `${rightPercent}%` }}>
                            {formatPrice(priceRange[1])}
                        </span>
                    </div>
                </div>
            </div>

            <div className="filter-item filter-item-full">
                <button onClick={onReset} className="reset-filters-btn">
                    <RotateCcw size={16} />
                    <span>العودة للافتراضي</span>
                </button>
            </div>
        </div>
    );
};

// --- Main SearchFilters Component ---
const SearchFilters = ({ activeFilter, onFilterChange, onSearchApply, currentFilters, onSearch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({});

    const { country } = useLocation();
    const provincesForCurrentCountry = locationData[country.code].provinces;
    const [searchQuery, setSearchQuery] = useState('');

    const handleFilterClick = (filter) => {
        onFilterChange(filter);
    };

    const openFilterModal = () => {
        setTempFilters(currentFilters);
        setIsModalOpen(true);
    };

    const handleConfirmFilters = () => {
        onSearchApply(tempFilters);
        setIsModalOpen(false);
    };

    const handleTempFilterChange = (filterName, value) => {
        setTempFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleResetFilters = () => {
        setTempFilters({}); // Reset to an empty object
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim(), activeFilter);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 2. Create the new handler to clear the search
    const handleClearSearch = () => {
        setSearchQuery(''); // Clear the input field
        onSearch('', activeFilter); // Tell HomePage to clear the search query in the URL
    };

    useEffect(() => {
        if (isModalOpen) {
            setTempFilters(currentFilters || {});
        }
    }, [activeFilter, isModalOpen, currentFilters]);

    return (
        <div className="search-container">
            <div className="main-search-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={24} />
                    <input
                        type="text"
                        placeholder="ابحث بالاسم، الموديل، أو المنطقة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {/* 3. Conditionally render the clear button */}
                    {searchQuery && (
                        <button className="clear-search-btn" onClick={handleClearSearch}>
                            <X size={20} />
                        </button>
                    )}
                </div>
                <button className="filter-btn" onClick={openFilterModal}>
                    <SlidersHorizontal size={20} />
                    <span>تصفية</span>
                </button>
                <button className="search-btn-main" onClick={handleSearch}>بحث</button>
            </div>

            <div className="icon-filter-bar">
                {/* ... The rest of the component remains the same ... */}
                <button
                    className={`icon-filter-btn ${activeFilter === 'cars' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('cars')}
                >
                    <Car size={20} />
                    <span>سيارات</span>
                </button>
                <button
                    className={`icon-filter-btn ${activeFilter === 'real-estate' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('real-estate')}
                >
                    <Home size={20} />
                    <span>عقارات</span>
                </button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmFilters}
                    title="فلاتر البحث المتقدمة"
                >
                    {activeFilter === 'cars' ? (
                        <CarFilters
                            filters={tempFilters}
                            onFilterChange={handleTempFilterChange}
                            provinces={provincesForCurrentCountry}
                            onReset={handleResetFilters}
                        />
                    ) : (
                        <RealEstateFilters
                            filters={tempFilters}
                            onFilterChange={handleTempFilterChange}
                            provinces={provincesForCurrentCountry}
                            onReset={handleResetFilters}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default SearchFilters;