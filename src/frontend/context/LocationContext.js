// src/frontend/context/LocationContext.js
import React, { createContext, useState, useContext, useMemo } from 'react';

// Define our supported countries and their properties
export const countries = {
    SY: { code: 'SY', name: 'Syria', currency: 'USD' }, // Keeping USD for now
    SA: { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
};

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    // Try to get the saved country from localStorage, default to Syria
    const [currentCountry, setCurrentCountry] = useState(() => {
        const savedCountryCode = localStorage.getItem('userCountry');
        return countries[savedCountryCode] || countries.SY;
    });

    const setCountry = (countryCode) => {
        const newCountry = countries[countryCode];
        if (newCountry) {
            setCurrentCountry(newCountry);
            localStorage.setItem('userCountry', countryCode);
        }
    };

    const value = useMemo(() => ({
        country: currentCountry,
        setCountry,
    }), [currentCountry]);

    return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
    return useContext(LocationContext);
};