// src/frontend/components/AdChoicePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Home } from 'lucide-react';
import '../styles/AdChoicePage.css';

const AdChoicePage = () => {
    const navigate = useNavigate();

    const handleChoice = (type) => {
        if (type === 'cars') {
            navigate('/add-car');
        } else {
            navigate('/add-real-estate');
        }
    };

    return (
        <div className="ad-choice-page-container">
            <div className="ad-choice-content">
                <h1>اختر نوع الإعلان</h1>
                <p>ما الذي تريد إضافته؟</p>

                <div className="ad-choice-cards">
                    <div className="ad-choice-card" onClick={() => handleChoice('real-estate')}>
                        <div className="card-icon">
                            <Home size={80} />
                        </div>
                        <h2>عقار</h2>
                        <p>أضف إعلان لعقارك</p>
                    </div>
                    
                    <div className="ad-choice-card" onClick={() => handleChoice('cars')}>
                        <div className="card-icon">
                            <Car size={80} />
                        </div>
                        <h2>سيارة</h2>
                        <p>أضف إعلان لبيع سيارتك</p>
                    </div>
                </div>

                <button className="back-btn" onClick={() => navigate(-1)}>
                    العودة
                </button>
            </div>
        </div>
    );
};

export default AdChoicePage;