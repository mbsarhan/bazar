// src/components/dashboard/MyCarAds.js
import React from 'react';
import { carAdsData } from './mockData';
import AdCard from './AdCard';

const MyCarAds = () => {
    return (
        <div>
            <div className="content-header">
                <h1>إعلاناتي للسيارات</h1>
            </div>
            <div className="ads-list-container">
                {carAdsData.map(ad => (
                    <AdCard key={ad.id} ad={ad} />
                ))}
            </div>
        </div>
    );
};

export default MyCarAds;