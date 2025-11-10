// src/frontend/components/LandingPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, countries } from '../context/LocationContext';
import { Car, Home, Globe } from 'lucide-react';
import '../styles/LandingPage.css';
import '../styles/forms.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { country, setCountry } = useLocation();

    // Check if user has visited before
    useEffect(() => {
        const hasVisited = sessionStorage.getItem('hasVisitedBefore');
        if (hasVisited) {
            // Redirect to home page if already visited
            navigate('/ads?type=cars', { replace: true });
        } else {
            // Mark as visited
            sessionStorage.setItem('hasVisitedBefore', 'true');
        }
    }, [navigate]);

    const handleChoice = (type) => {
        navigate(`/ads?type=${type}`);
    };

    // Sample data for animated cards
    const carAds = [
        { id: 1, title: 'Toyota Camry 2023', price: '25,000' },
        { id: 2, title: 'BMW X5 2022', price: '45,000' },
        { id: 3, title: 'Mercedes C-Class', price: '38,000' },
        { id: 4, title: 'Honda Accord 2024', price: '28,000' },
        { id: 5, title: 'Audi A4 2023', price: '42,000' },
    ];

    const realEstateAds = [
        { id: 1, title: 'شقة 3 غرف', price: '150,000' },
        { id: 2, title: 'فيلا فاخرة', price: '450,000' },
        { id: 3, title: 'استوديو حديث', price: '80,000' },
        { id: 4, title: 'بنتهاوس', price: '320,000' },
        { id: 5, title: 'شقة عائلية', price: '200,000' },
    ];

    return (
        <div className="landing-page-container">
            {/* Animated background cards */}
            <div className="animated-bg">
                {/* Cars rising on the right */}
                <div className="animated-column cars-column">
                    {[...carAds, ...carAds].map((ad, index) => (
                        <div key={`car-${index}`} className="floating-ad-card car-card">
                            <Car size={24} />
                            <div className="ad-info">
                                <h4>{ad.title}</h4>
                                <p>${ad.price}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Real estate descending on the left */}
                <div className="animated-column real-estate-column">
                    {[...realEstateAds, ...realEstateAds].map((ad, index) => (
                        <div key={`re-${index}`} className="floating-ad-card re-card">
                            <Home size={24} />
                            <div className="ad-info">
                                <h4>{ad.title}</h4>
                                <p>${ad.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="landing-header">
                <h1 className="landing-logo">ديّلها</h1>
            </div>

            <div className="form-container choice-container">
                <h2>ديّلها معنا</h2>

                {/* Country Selector */}
                <div className="landing-country-selector">
                    <Globe size={20} />
                    <select
                        value={country.code}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {Object.values(countries).map((countryOption) => (
                            <option key={countryOption.code} value={countryOption.code}>
                                {countryOption.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="landing-choices-wrapper">
                    <div className="landing-choice-card" onClick={() => handleChoice('real-estate')}>
                        <Home size={64} />
                        <h3>عقار</h3>
                    </div>
                    <div className="landing-choice-card" onClick={() => handleChoice('cars')}>
                        <Car size={64} />
                        <h3>سيارة</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;