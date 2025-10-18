// src/frontend/components/dashboard/MyRealEstateAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import AdCardSkeleton from './AdCardSkeleton';
import Modal from './Modal'; // 1. Import your Modal component
import { useAds } from '../../context/AdContext';
import '../../styles/StatusFilter.css';
// We are not using the context for now, so the import can be removed if you wish

const MyRealEstateAds = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getMyRealEstateAds ,deleteRealEstateAd} = useAds();
    const [activeStatus, setActiveStatus] = useState('all');

    // --- 3. Add state for the delete modal ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');


    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getMyRealEstateAds();
                setAds(data);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching ads.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [getMyRealEstateAds]); // Runs once on mount


    // --- 4. Create functions to handle the delete flow ---
    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setDeleteError('');
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!adToDelete) return;

        try {
            await deleteRealEstateAd(adToDelete.id);
            // On success, update the UI instantly
            setAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete.id));
            setIsDeleteModalOpen(false);
            setAdToDelete(null);
        } catch (err) {
            // Display any error from the API inside the modal
            setDeleteError(err.response?.data?.message || 'Failed to delete the ad.');
        }
    };



    return (
        <div>
            <div className="content-header">
                <h1>إعلاناتي للعقارات</h1>
            </div>

            <div className="status-filter-bar">
                <button className={activeStatus === 'all' ? 'active' : ''} onClick={() => setActiveStatus('all')}>الكل</button>
                <button className={activeStatus === 'فعال' ? 'active' : ''} onClick={() => setActiveStatus('فعال')}>فعال</button>
                <button className={activeStatus === 'قيد المراجعة' ? 'active' : ''} onClick={() => setActiveStatus('قيد المراجعة')}>قيد المراجعة</button>
                <button className={activeStatus === 'مباع' ? 'active' : ''} onClick={() => setActiveStatus('مباع')}>مباع</button>
                <button className={activeStatus === 'مؤجر' ? 'active' : ''} onClick={() => setActiveStatus('مؤجر')}>مؤجر</button>
            </div>


            <div className="ads-list-container">
                {isLoading ? (
                    // If loading, render the skeletons
                    Array.from({ length: 4 }).map((_, index) => (
                        <AdCardSkeleton key={index} />
                    ))
                ) : error ? (
                    <p className="error-message">خطأ في تحميل الإعلانات: {error}</p>
                ) : ads.length > 0 ? (
                    // If not loading and ads exist, render the real ads
                    ads.map(ad => (
                        <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            onDelete={() => handleDeleteClick(ad)}
                            // The onDelete prop is removed for now
                        />
                    ))
                ) : (
                    // If not loading and no ads exist, render the "no ads" message
                    <p>ليس لديك أي إعلانات عقارات منشورة حالياً.</p>
                )}
            </div>
            {/* --- 6. Add the confirmation modal to the JSX --- */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="تأكيد حذف الإعلان"
            >
                <p>هل أنت متأكد أنك تريد حذف هذا الإعلان؟ سيتم حذف جميع الصور والفيديوهات المرتبطة به بشكل دائم.</p>
                {deleteError && <p className="error-message" style={{ marginTop: '15px' }}>{deleteError}</p>}
            </Modal>

        </div>
    );
};

export default MyRealEstateAds;