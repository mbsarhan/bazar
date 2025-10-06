// src/components/dashboard/MyCarAds.js
import React, { useState, useEffect } from 'react';
import AdCard from './AdCard';
import Modal from './Modal'; // <-- 1. IMPORT YOUR MODAL COMPONENT
import { useAds } from '../../context/AdContext'; // 1. Import the hook

const MyCarAds = () => {
// 2. Set up state for ads, loading, and errors
const [ads, setAds] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);
const { getMyCarAds,deleteCarAd } = useAds(); // <-- 2. GET deleteCarAd FROM CONTEXT

// --- 3. ADD STATE FOR THE DELETE MODAL ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState('');


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


// --- 4. CREATE FUNCTIONS TO HANDLE THE DELETE FLOW ---

    // This function is called when a user clicks the "Delete" button on an AdCard
    const handleDeleteClick = (ad) => {
        setAdToDelete(ad); // Set which ad we are targeting
        setDeleteError(''); // Clear any previous errors
        setIsDeleteModalOpen(true); // Open the modal
    };

    // This function is called when the user confirms the deletion in the modal
    const handleDeleteConfirm = async () => {
        if (!adToDelete) return;

        try {
            await deleteCarAd(adToDelete.id);
            // On success, remove the ad from the local state for an instant UI update
            setAds(prevAds => prevAds.filter(ad => ad.id !== adToDelete.id));
            setIsDeleteModalOpen(false); // Close the modal
            setAdToDelete(null); // Reset the targeted ad
        } catch (err) {
            // If the API returns an error, display it in the modal
            setDeleteError(err.message);
        }
    };


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
                    // 5. PASS the handleDeleteClick function to each AdCard
                    <AdCard key={ad.id} ad={ad} onDelete={() => handleDeleteClick(ad)} 
                            />
                ))
            ) : (
                <p>ليس لديك أي إعلانات سيارات منشورة حالياً.</p>
            )}
        </div>
         {/* --- 6. ADD THE DELETE CONFIRMATION MODAL --- */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="تأكيد حذف الإعلان"
            >
                <p>هل أنت متأكد أنك تريد حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.</p>
                {/* Display an error message inside the modal if the delete fails */}
                {deleteError && <p className="error-message" style={{marginTop: '15px'}}>{deleteError}</p>}
            </Modal>
    </div>
);
};

export default MyCarAds;