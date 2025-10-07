import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
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
    
        
        navigate(`/ad/${ad.id}`);

    } ;

    // Stop propagation on delete button to prevent navigation
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete();
    };


    return (
        <div className="ad-card">
            <Link to={`/ad/${ad.id}`} className="ad-card-clickable-area">
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
                        {ad.year && (
                            <>
                                <div className="spec-item"><Wrench size={16} /><span>{ad.condition}</span></div>
                                <div className="spec-item"><Calendar size={16} /><span>{ad.year}</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.location.split(',')[0]}</span></div>
                                <div className="spec-item"><GaugeCircle size={16} /><span>{formatNumber(ad.mileage)} كم</span></div>
                                <div className="spec-item"><GitCommitVertical size={16} /><span>{ad.transmission}</span></div>
                                <div className="spec-item"><Fuel size={16} /><span>{ad.fuelType}</span></div>
                            </>
                        )}
                        {ad.propertyType && (
                            <>
                                <div className="spec-item"><Home size={16} /><span>{ad.propertyType}</span></div>
                                <div className="spec-item"><MapPin size={16} /><span>{ad.location}</span></div>
                                <div className="spec-item"><Square size={16} /><span>{ad.area} م²</span></div>
                                <div className="spec-item"><BedDouble size={16} /><span>{ad.bedrooms} غرف نوم</span></div>
                            </>
                        )}
                    </div>
                </div>
            </Link>

            {!isPublic && (
                <div className="ad-card-actions">
                    <button className="action-btn view-btn" onClick={handleShowClick}><ViewIcon /> عرض</button>
                    <button className="action-btn edit-btn"><EditIcon /> تعديل</button>
                    <button className="action-btn delete-btn" onClick={handleDeleteClick}><DeleteIcon /> حذف</button>
                </div>
            )}
        </div>
    );
};

export default AdCard;