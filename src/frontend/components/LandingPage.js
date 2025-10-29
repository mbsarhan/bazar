// src/frontend/components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, countries } from '../context/LocationContext';
import { Car, Home, Globe } from 'lucide-react';
import '../styles/LandingPage.css'; // New dedicated CSS file
import '../styles/forms.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { country, setCountry } = useLocation();

    const handleChoice = (type) => {
        // Navigate to the ads page with the chosen type set in the URL
        navigate(`/ads?type=${type}`);
    };

    return (
        <div className="landing-page-container">
            <div className="landing-header">
                <h1 className="landing-logo">ديّلها</h1>
            </div>

            <div className="form-container choice-container">
                <h2>ديّلها معنا</h2>

                {/* --- The New Country Selector --- */}
                <div className="landing-country-selector">
                    <Globe size={20} />
                    <select
                        value={country.code}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {Object.values(countries).map((countryOption) => (
                            <option key={countryOption.code} value={countryOption.code}>
                                {/* --- THIS IS THE FIX --- */}
                                {/* Display the Arabic name to the user */}
                                {countryOption.displayName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="landing-choices-wrapper">
                    <div className="landing-choice-card" onClick={() => handleChoice('cars')}>
                        <Car size={64} />
                        <h3>سيارة</h3>
                    </div>
                    <div className="landing-choice-card" onClick={() => handleChoice('real-estate')}>
                        <Home size={64} />
                        <h3>عقار</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;