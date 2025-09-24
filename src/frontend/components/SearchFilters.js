// src/components/SearchFilters.js
import React, { useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import Modal from './dashboard/Modal'; // We'll reuse our excellent Modal component
import '../styles/SearchFilters.css';

const SearchFilters = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

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

            {/* --- New Big Search Bar Layout --- */}
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

            {/* --- Filters Modal --- */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    // Logic to apply filters will go here
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

// --- Car Filters (Now for the Modal) ---
const CarFilters = () => {
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
             <div className="filter-item">
                <label>السعر الأدنى</label>
                <input type="number" placeholder="مثال: 50,000,000" />
            </div>
            <div className="filter-item">
                <label>السعر الأعلى</label>
                <input type="number" placeholder="مثال: 100,000,000" />
            </div>
        </div>
    );
};

// --- Real Estate Filters (Now for the Modal) ---
const RealEstateFilters = () => {
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
            <div className="filter-item">
                <label>نوع الصفقة</label>
                 <select>
                    <option value="">الكل</option>
                    <option value="sale">بيع</option>
                    <option value="rent">إيجار</option>
                </select>
            </div>
             <div className="filter-item">
                <label>المساحة الأدنى (م²)</label>
                <input type="number" placeholder="مثال: 90" />
            </div>
        </div>
    );
};

export default SearchFilters;