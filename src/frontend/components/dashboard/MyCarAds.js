// src/components/dashboard/MyCarAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import { useAds } from '../../context/AdContext'; // 1. Import the hook

const MyCarAds = () => {
// 2. Set up state for ads, loading, and errors
const [ads, setAds] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const { getMyCarAds } = useAds(); // 3. Get the function from the context
useEffect(() => {
    const fetchAds = async () => {
        try {
            setIsLoading(true);
            const data = await getMyCarAds();
            setAds(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };fetchAds();
}, []); // The empty array [] ensures this runs only once on mount
// 5. Render content based on the state
if (isLoading) {
    return <p>جاري تحميل الإعلانات...</p>;
}

if (error) {
    return <p className="error-message">خطأ في تحميل الإعلانات: {error}</p>;
}

return (
    <div>
        <div className="content-header">
            <h1>إعلاناتي للسيارات</h1>
        </div>
        <div className="ads-list-container">
            {ads.length > 0 ? (
                ads.map(ad => (
                    <AdCard key={ad.id} ad={ad} />
                ))
            ) : (
                <p>ليس لديك أي إعلانات سيارات منشورة حالياً.</p>
            )}
        </div>
    </div>
);
};

export default MyCarAds;