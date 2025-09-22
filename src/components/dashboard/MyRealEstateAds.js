// src/components/dashboard/MyRealEstateAds.js
import React from 'react';
import { realEstateAdsData } from './mockData';
import AdCard from './AdCard';

const MyRealEstateAds = () => {
    return (
        <div>
            <div className="content-header">
                <h1>إعلاناتي للعقارات</h1>
            </div>
            <div className="ads-list-container">
                {realEstateAdsData.map(ad => (
                    <AdCard key={ad.id} ad={ad} />
                ))}
            </div>
        </div>
    );
};

export default MyRealEstateAds;