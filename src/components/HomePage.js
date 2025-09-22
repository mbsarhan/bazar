// src/components/HomePage.js
import React from 'react';
import { carAdsData, realEstateAdsData } from './dashboard/mockData';
// سنحتاج إلى بطاقة عرض عامة، يمكننا تعديل AdCard لاحقاً أو إنشاء واحدة جديدة
// للتبسيط الآن، سنستخدم نفس تصميم AdCard لكن بدون أزرار التحكم
import AdCard from './dashboard/AdCard'; 
import '../styles/HomePage.css';

const HomePage = () => {
    // دمج وترتيب جميع الإعلانات حسب الأحدث (نفترض أن id الأكبر هو الأحدث)
    const allAds = [...carAdsData, ...realEstateAdsData]
    .filter(ad => ad.status === 'فعال') // <-- هذا هو السطر الجديد الذي يقوم بالتصفية
    .sort((a, b) => b.id - a.id);

    return (
        <div className="home-page-container">
            <h1>أحدث الإعلانات</h1>
            <div className="ads-list-container">
                {allAds.map(ad => (
                    // يجب تعديل AdCard لكي لا تظهر أزرار التحكم للزوار
                    <AdCard key={ad.id} ad={ad} isPublic={true} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;