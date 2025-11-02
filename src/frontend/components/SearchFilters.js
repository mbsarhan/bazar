// src/frontend/components/SearchFilters.js
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Search, Car, Home } from 'lucide-react';
import Slider from 'rc-slider';
import Modal from './dashboard/Modal';
import { useLocation } from '../context/LocationContext'; // 1. Import the location hook
import { locationData } from '../context/locationData';
import '../styles/SearchFilters.css';

const formatPrice = (val) => `$${val.toLocaleString('en-US')}`;

// --- Car Filters Component ---
const CarFilters = ({ filters, onFilterChange, provinces }) => {
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
                <select>
                    <option value="">الكل</option>
                    <option value="new">جديدة</option>
                    <option value="used">مستعملة</option>
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
        </div>
    );
};

// --- Real Estate Filters Component ---
const RealEstateFilters = ({ filters, onFilterChange, provinces }) => {
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
                <select>
                    <option value="">الكل</option>
                    <option value="apartment">شقة</option>
                    <option value="villa">فيلا</option>
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
        </div>
    );
};

// --- Main SearchFilters Component ---
const SearchFilters = ({ activeFilter, onFilterChange, onSearchApply, currentFilters, provinces }) => {
    // 1. New state: 'all' is the default
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState({});

    const { country } = useLocation();
    const provincesForCurrentCountry = locationData[country.code].provinces;

    const handleFilterClick = (filter) => {
        onFilterChange(filter); // Notify the parent component (HomePage) of the change
    };

    const openFilterModal = () => {
        setTempFilters(currentFilters);
        setIsModalOpen(true);
    };

    const handleConfirmFilters = () => {
        // onSearchApply is a new function we'll add to HomePage
        onSearchApply(tempFilters);
        setIsModalOpen(false);
    };

    const handleTempFilterChange = (filterName, value) => {
        setTempFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    useEffect(() => {
        if (isModalOpen) {
            setTempFilters(currentFilters || {});
        }
    }, [activeFilter, isModalOpen, currentFilters]);

    return (
        <div className="search-container">
            {/* --- The Big Search Bar (remains the same) --- */}
            <div className="main-search-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={24} />
                    <input type="text" placeholder="ابحث بالاسم، الموديل، أو المنطقة..." />
                </div>
                <button className="filter-btn" onClick={openFilterModal}>
                    <SlidersHorizontal size={20} />
                    <span>تصفية</span>
                </button>
                <button className="search-btn-main">بحث</button>
            </div>

            {/* --- 2. The NEW Icon Filter Bar --- */}
            <div className="icon-filter-bar">
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
                        />
                    ) : (
                        <RealEstateFilters
                            filters={tempFilters}
                            onFilterChange={handleTempFilterChange}
                            provinces={provincesForCurrentCountry}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default SearchFilters;