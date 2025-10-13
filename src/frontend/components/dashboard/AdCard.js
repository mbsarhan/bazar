import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { useAds } from '../../context/AdContext';
import { 
    ChevronLeft, ChevronRight, GaugeCircle, Calendar, MapPin, 
    GitCommitVertical, Fuel, Wrench, Home, Square, BedDouble, 
    Eye, Edit, Trash2, ExternalLink
} from 'lucide-react';

// Re-defining these here for completeness as simple functional components
const EditIcon = () => <Edit size={16} />;
const DeleteIcon = () => <Trash2 size={16} />;
const ViewIcon = () => <ExternalLink size={16} />;

const AdCard = ({ ad, isPublic = false, onDelete }) => {

    const navigate = useNavigate();
    const { incrementAdView } = useAds();
    const [currentIndex, setCurrentIndex] = useState(0);

    const getStatusClass = (status) => {
        if (status === 'فعال') return 'status-active';
        if (status === 'قيد المراجعة') return 'status-pending';
        if (status === 'مباع' || status === 'مؤجر') return 'status-sold';
        return '';
    };

    const formatNumber = (num) => num ? num.toLocaleString('en-US') : '0';

    const prevSlide = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? ad.imageUrls.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const isLastSlide = currentIndex === ad.imageUrls.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (e, slideIndex) => {
        e.stopPropagation();
        e.preventDefault();
        setCurrentIndex(slideIndex);
    };

    // --- Advanced Dynamic Dots Logic ---
    const getVisibleDots = () => {
        const total = ad.imageUrls.length;
        if (total <= 3) {
            return Array.from({ length: total }, (_, i) => ({ index: i, size: 'normal' }));
        }

        if (currentIndex === 0 || currentIndex === 1) {
            return [{ index: 0, size: 'normal' }, { index: 1, size: 'normal' }, { index: 2, size: 'normal' }];
        }
        if (currentIndex >= 2 && currentIndex <= total - 3) {
            return [
                { index: currentIndex - 1, size: 'small' },
                { index: currentIndex, size: 'normal' },
                { index: currentIndex + 1, size: 'small' }
            ];
        }
        if (currentIndex === total - 2 || currentIndex === total - 1) {
            return [
                { index: total - 3, size: 'normal' },
                { index: total - 2, size: 'normal' },
                { index: total - 1, size: 'normal' }
            ];
        }
        return [];
    };
    
    const handleShowClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Step 1: Call the API and wait for it to finish.
        incrementAdView(ad.id);
        navigate(`/ad/${ad.id}`);
    } ;

    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Determine the correct edit path based on the ad type
        const editPath = ad.model_year ? `/dashboard/edit-car/${ad.id}` : `/dashboard/edit-real-estate/${ad.id}`;
        navigate(editPath);
    };

    // Stop propagation on delete button to prevent navigation
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete();
    };


    return (
        <div className="ad-card" onClick={handleShowClick}>
            <Link to={`/ad/${ad.id}`} className="ad-card-clickable-area" onClick={handleShowClick}>
                <div className="ad-card-image">
                    <img src={ad.imageUrls[currentIndex]} alt={ad.title} />
                    
                    <div className="ad-card-views">
                        <Eye size={16} />
                        <span>{formatNumber(ad.views)}</span>
                    </div>

                    {ad.imageUrls.length > 1 && (
                        <>
                            <button className="nav-arrow left" onClick={prevSlide}><ChevronLeft size={24} /></button>
                            <button className="nav-arrow right" onClick={nextSlide}><ChevronRight size={24} /></button>
                            
                            <div className="pagination-dots">
                                {getVisibleDots().map((dotInfo) => (
                                    <div
                                        key={dotInfo.index}
                                        className={`dot ${currentIndex === dotInfo.index ? 'active' : ''} ${dotInfo.size === 'small' ? 'small' : ''}`}
                                        onClick={(e) => goToSlide(e, dotInfo.index)}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                {!isPublic && ( <span className={`ad-card-status ${getStatusClass(ad.status)}`}>{ad.status}</span> )}
                </div>
                <div className="ad-card-details">
                    <h3>{ad.title}</h3>
                    <p className="ad-card-price">{ad.price}</p>
                    <div className="ad-card-specs">
                        {ad.model_year && (
                            <>
                                <div className="spec-item"><Wrench size={16} /><span>{ad.condition}</span></div>
                                <div className="spec-item"><Calendar size={16} /><span>{ad.model_year}</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.governorate}</span></div>
                                <div className="spec-item"><GaugeCircle size={16} /><span>{formatNumber(ad.distance_traveled)} كم</span></div>
                                <div className="spec-item"><GitCommitVertical size={16} /><span>{ad.gear}</span></div>
                                <div className="spec-item"><Fuel size={16} /><span>{ad.fuel_type}</span></div>
                            </>
                        )}
                        {ad.realestate_type && (
                            <>
                                <div className="spec-item"><Home size={16} /><span>{ad.realestate_type}</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.location}</span></div>
                                <div className="spec-item"><Square size={16} /><span>{ad.area} م²</span></div>
                                <div className="spec-item"><BedDouble size={16} /><span>{ad.bedroom_num} غرف نوم</span></div>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {!isPublic && (
                <div className="ad-card-actions">
                    <button className="action-btn view-btn" onClick={handleShowClick}><ViewIcon /> عرض</button>
                    <button className="action-btn edit-btn" onClick={handleEditClick}><EditIcon /> تعديل</button>
                    <button className="action-btn delete-btn" onClick={handleDeleteClick}><DeleteIcon /> حذف</button>
                </div>
            )}
        </div>
    );
};

export default AdCard;