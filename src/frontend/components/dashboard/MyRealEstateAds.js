// src/frontend/components/dashboard/MyRealEstateAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import Modal from './Modal';
import StatusUpdateModal from './StatusUpdateModal'; // New component
import { useAds } from '../../context/AdContext';
import AdCardSkeleton from './AdCardSkeleton';
import '../../styles/StatusFilter.css';

const MyRealEstateAds = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getMyRealEstateAds, deleteRealEstateAd, updateRealEstateAdStatus } = useAds();
    const [activeStatus, setActiveStatus] = useState('all');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [adToUpdate, setAdToUpdate] = useState(null);
    const [statusUpdateError, setStatusUpdateError] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getMyRealEstateAds({ status: activeStatus });
                setAds(data);
            } catch (err) {
                setError(err.message || 'An error occurred while fetching ads.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAds();
    }, [getMyRealEstateAds, activeStatus]);


    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setDeleteError('');
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!adToDelete) return;

        try {
            await deleteRealEstateAd(adToDelete.id);
            setAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete.id));
            setIsDeleteModalOpen(false);
            setAdToDelete(null);
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Failed to delete the ad.');
        }
    };

    const handleStatusUpdateClick = (ad) => {
        setAdToUpdate(ad);
        setStatusUpdateError('');
        setIsStatusModalOpen(true);
    };

    const handleStatusUpdateConfirm = async (newStatus) => {
        if (!adToUpdate) return;

        try {
            await updateRealEstateAdStatus(adToUpdate.id, newStatus);
            
            // Update the ad in the local state
            setAds(prevAds => prevAds.map(ad => 
                ad.id === adToUpdate.id 
                    ? { ...ad, status: newStatus }
                    : ad
            ));
            
            setIsStatusModalOpen(false);
            setAdToUpdate(null);
        } catch (err) {
            setStatusUpdateError(err.message);
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
                    Array.from({ length: 4 }).map((_, index) => (
                        <AdCardSkeleton key={index} />
                    ))
                ) : error ? (
                    <p className="error-message">خطأ في تحميل الإعلانات: {error}</p>
                ) : ads.length > 0 ? (
                    (() => {
                        // 1. Get the list of IDs from the currently filtered ads.
                        const filteredAdIds = ads.map(ad => ad.id);

                        // 2. Map over the ads and pass the ID list to each AdCard.
                        return ads.map(ad => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                                onDelete={() => handleDeleteClick(ad)}
                                onStatusUpdate={() => handleStatusUpdateClick(ad)}
                                adIdList={filteredAdIds} // <-- PASS THE CONTEXTUAL LIST HERE
                            />
                        ));
                    })()
                ) : (
                    <p>ليس لديك أي إعلانات عقارات منشورة حالياً.</p>
                )}
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="تأكيد حذف الإعلان"
            >
                <p>هل أنت متأكد أنك تريد حذف هذا الإعلان؟ سيتم حذف جميع الصور والفيديوهات المرتبطة به بشكل دائم.</p>
                {deleteError && <p className="error-message" style={{ marginTop: '15px' }}>{deleteError}</p>}
            </Modal>

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={isStatusModalOpen}
                onClose={() => setIsStatusModalOpen(false)}
                onConfirm={handleStatusUpdateConfirm}
                currentStatus={adToUpdate?.status}
                adTitle={adToUpdate?.title}
                error={statusUpdateError}
            />
        </div>
    );
};

export default MyRealEstateAds;