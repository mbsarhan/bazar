// src/frontend/components/SearchFilters.js
import React, { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import Slider from 'rc-slider';
import Modal from './dashboard/Modal';
import '../styles/SearchFilters.css';

// Formatting remains for USD, but the output string is just the number
const formatPrice = (val) => `$${val.toLocaleString('en-US')}`;

const SearchFilters = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="search-container">
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
                <button className="filter-btn" onClick={() => setIsModalOpen(true)}>
                    <SlidersHorizontal size={20} />
                    <span>فلاتر</span>
                </button>
                <button className="search-btn-main">
                    بحث
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    setIsModalOpen(false);
                }}
                title="فلاتر البحث المتقدمة"
            >
                {activeTab === 'cars' && <CarFilters />}
                {activeTab === 'real-estate' && <RealEstateFilters />}
            </Modal>
        </div>
    );
};

// --- Car Filters with USD Range Slider ---
const CarFilters = () => {
    const [priceRange, setPriceRange] = useState([2000, 20000]);

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
                    {/* --- FIX: Use <Slider range ... /> instead of <Range ... /> --- */}
                    <Slider 
                        range
                        min={1000}
                        max={50000}
                        step={500}
                        value={priceRange}
                        onChange={setPriceRange}
                        allowCross={false}
                    />
                    <div className="range-labels">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RealEstateFilters = () => {
    const [priceRange, setPriceRange] = useState([25000, 250000]);
    
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
                     {/* --- FIX: Use <Slider range ... /> instead of <Range ... /> --- */}
                     <Slider 
                        range
                        min={10000}
                        max={500000}
                        step={5000}
                        value={priceRange}
                        onChange={setPriceRange}
                        allowCross={false}
                    />
                    <div className="range-labels">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;