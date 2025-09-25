// src/frontend/components/SearchFilters.js
import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
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
const SearchFilters = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // "Committed" filter state that lives in the parent
    const [carFilters, setCarFilters] = useState({ priceRange: [0, 300000] });
    const [realEstateFilters, setRealEstateFilters] = useState({ priceRange: [0, 1000000] });

    // "Temporary" state for the modal to work on
    const [tempFilters, setTempFilters] = useState({});

    // When the modal opens, copy the current filters to the temporary state
    const openFilterModal = () => {
        const currentFilters = activeTab === 'cars' ? carFilters : realEstateFilters;
        setTempFilters(currentFilters);
        setIsModalOpen(true);
    };

    // When "Confirm" is clicked, save temp state to the main state
    const handleConfirmFilters = () => {
        if (activeTab === 'cars') {
            setCarFilters(tempFilters);
        } else {
            setRealEstateFilters(tempFilters);
        }
        setIsModalOpen(false);
        // Here you would trigger the actual search/filtering of the main page
        console.log("Filters Saved:", tempFilters);
    };

    // A function to update the temporary state from within the modal
    const handleTempFilterChange = (filterName, value) => {
        setTempFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };
    
    // When switching tabs, if the modal is open, update the temp filters
    useEffect(() => {
        if(isModalOpen) {
            const currentFilters = activeTab === 'cars' ? carFilters : realEstateFilters;
            setTempFilters(currentFilters);
        }
    }, [activeTab, isModalOpen]);

    return (
        <div className="search-container">
            {/* --- UI WAS MISSING FROM HERE --- */}
            <div className="search-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cars')}
                >
                    البحث عن سيارة
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'real-estate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('real-estate')}
                >
                    البحث عن عقار
                </button>
            </div>

            <div className="main-search-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" size={24} />
                    <input 
                        type="text" 
                        placeholder={activeTab === 'cars' ? "ابحث بالاسم أو الموديل (كيا ريو...)" : "ابحث بالمنطقة أو العنوان..."} 
                    />
                </div>
                <button className="filter-btn" onClick={openFilterModal}>
                    <SlidersHorizontal size={20} />
                    <span>فلاتر</span>
                </button>
                <button className="search-btn-main">
                    بحث
                </button>
            </div>
            {/* --- END OF MISSING UI --- */}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmFilters}
                title="فلاتر البحث المتقدمة"
            >
                {activeTab === 'cars' ? (
                    <CarFilters filters={tempFilters} onFilterChange={handleTempFilterChange} />
                ) : (
                    <RealEstateFilters filters={tempFilters} onFilterChange={handleTempFilterChange} />
                )}
            </Modal>
        </div>
    );
};

export default SearchFilters;