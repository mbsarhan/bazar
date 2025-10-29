// src/frontend/components/FeaturedCarousel.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Import Swiper and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// 2. Import Swiper's CSS for the modules
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// 3. Import our custom CSS for styling
import '../styles/FeaturedCarousel.css';

// We'll use our existing mock data for now
import { carAdsData } from './dashboard/mockData';

const FeaturedCarousel = () => {
    const navigate = useNavigate();
    // Get the first 4 ads to feature
    const featuredAds = carAdsData.slice(0, 4);

    return (
        <div className="featured-carousel-container">
            <Swiper
                // Install Swiper modules
                modules={[Autoplay, Pagination, Navigation]}
                
                // Swiper settings
                spaceBetween={30}
                centeredSlides={true}
                loop={true} // Allows infinite looping
                autoplay={{
                    delay: 5000, // 5 seconds
                    disableOnInteraction: false, // Autoplay continues after user interaction
                }}
                pagination={{
                    clickable: true, // Allows clicking the dots
                }}
                navigation={true} // Shows the left/right arrows
                
                className="myFeaturedSwiper"
            >
                {featuredAds.map(ad => (
                    <SwiperSlide key={ad.id} onClick={() => navigate(`/ad/${ad.id}`)}>
                        <img src={ad.imageUrls[0]} alt={ad.title} />
                        <div className="slide-caption">
                            <h3>{ad.title}</h3>
                            <p>{ad.price}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default FeaturedCarousel;