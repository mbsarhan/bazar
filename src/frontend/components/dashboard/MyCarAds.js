// src/components/dashboard/MyCarAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import Modal from './Modal';
import { useAds } from '../../context/AdContext';
import AdCardSkeleton from './AdCardSkeleton';
import '../../styles/StatusFilter.css';

const MyCarAds = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getMyCarAds, deleteCarAd } = useAds();
    const [activeStatus, setActiveStatus] = useState('all');

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');


    useEffect(() => {
        const fetchAds = async () => {
            setIsLoading(true);
            try {
                const data = await getMyCarAds({ status: activeStatus });
                setAds(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }; fetchAds();
    }, [getMyCarAds,activeStatus]);


    const handleDeleteClick = (ad) => {
        setAdToDelete(ad);
        setDeleteError('');
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!adToDelete) return;

        try {
            await deleteCarAd(adToDelete.id);
            setAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete.id));
            setIsDeleteModalOpen(false);
            setAdToDelete(null);
        } catch (err) {
            setDeleteError(err.message);
        }
    };


    if (error) {
        return (
            <div>
                <div className="content-header"><h1>إعلاناتي للسيارات</h1></div>
                <p className="error-message">خطأ في تحميل الإعلانات: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="content-header">
                <h1>إعلاناتي للسيارات</h1>
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
                ) : ads.length > 0 ? (
                    (() => {
                        // 1. Get the list of IDs from your currently filtered ads.
                        const filteredAdIds = ads.map(ad => ad.id);

                        // 2. Map over the ads and pass the ID list to each AdCard.
                        return ads.map(ad => (
                            <AdCard 
                                key={ad.id} 
                                ad={ad} 
                                onDelete={() => handleDeleteClick(ad)} 
                                adIdList={filteredAdIds} // <-- PASS THE CONTEXTUAL LIST HERE
                            />
                        ));
                    })()
                ) : (
                    <p>ليس لديك أي إعلانات سيارات منشورة حالياً.</p>
                )}
            </div>
            
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="تأكيد حذف الإعلان"
            >
                <p>هل أنت متأكد أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.</p>
                {deleteError && <p className="error-message" style={{ marginTop: '15px' }}>{deleteError}</p>}
            </Modal>
        </div>
    );
};

export default MyCarAds;