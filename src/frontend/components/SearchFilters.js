// src/frontend/components/SearchFilters.js
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Search, Car, Home, LayoutGrid } from 'lucide-react';
import Slider from 'rc-slider';
import Modal from './dashboard/Modal';
import '../styles/SearchFilters.css';

const formatPrice = (val) => `$${val.toLocaleString('en-US')}`;

// --- Car Filters Component ---
const CarFilters = ({ filters, onFilterChange }) => {
    const MIN = 0;
    const MAX = 300000;

    const leftPercent = ((filters.priceRange[0] - MIN) / (MAX - MIN)) * 100;
    const rightPercent = ((filters.priceRange[1] - MIN) / (MAX - MIN)) * 100;
    const areLabelsClose = (filters.priceRange[1] - filters.priceRange[0]) < (MAX - MIN) * 0.18;

    return (
        <div className="modal-filters-grid">
            <div className="filter-item">
                <label>المحافظة</label>
                <select>
                    <option value="">كل المحافظات</option>
                    <option value="damascus">دمشق</option>
                    <option value="aleppo">حلب</option>
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
                        value={filters.priceRange} 
                        onChange={newRange => onFilterChange('priceRange', newRange)} 
                        allowCross={false}
                    />
                    <div className={`range-labels ${areLabelsClose ? 'labels-are-close' : ''}`}>
                        <span className="range-label-min" style={{ left: `${leftPercent}%` }}>
                            {formatPrice(filters.priceRange[0])}
                        </span>
                        <span className="range-label-max" style={{ left: `${rightPercent}%` }}>
                            {formatPrice(filters.priceRange[1])}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Real Estate Filters Component ---
const RealEstateFilters = ({ filters, onFilterChange }) => {
    const MIN = 0;
    const MAX = 1000000;

    const leftPercent = ((filters.priceRange[0] - MIN) / (MAX - MIN)) * 100;
    const rightPercent = ((filters.priceRange[1] - MIN) / (MAX - MIN)) * 100;
    const areLabelsClose = (filters.priceRange[1] - filters.priceRange[0]) < (MAX - MIN) * 0.20;

    return (
        <div className="modal-filters-grid">
            <div className="filter-item">
                <label>المحافظة</label>
                <select>
                    <option value="">كل المحافظات</option>
                    <option value="damascus">دمشق</option>
                    <option value="aleppo">حلب</option>
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
                        range min={MIN} max={MAX} step={10000}
                        value={filters.priceRange} 
                        onChange={newRange => onFilterChange('priceRange', newRange)} 
                        allowCross={false}
                    />
                    <div className={`range-labels ${areLabelsClose ? 'labels-are-close' : ''}`}>
                        <span className="range-label-min" style={{ left: `${leftPercent}%` }}>
                            {formatPrice(filters.priceRange[0])}
                        </span>
                        <span className="range-label-max" style={{ left: `${rightPercent}%` }}>
                            {formatPrice(filters.priceRange[1])}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main SearchFilters Component ---
const SearchFilters = ({ activeFilter, onFilterChange }) => {
    // 1. New state: 'all' is the default

    const handleFilterClick = (filter) => {
        onFilterChange(filter); // Notify the parent component (HomePage) of the change
    };

    return (
        <div className="search-container">
            {/* --- The Big Search Bar (remains the same) --- */}
            <div className="main-search-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={24} />
                    <input type="text" placeholder="ابحث بالاسم، الموديل، أو المنطقة..." />
                </div>
                {/* We can hide the modal button for now, or connect it later */}
                {/* <button className="filter-btn" onClick={() => {}}>... فلاتر</button> */}
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
            </div>
        </div>
    );
};

export default SearchFilters;