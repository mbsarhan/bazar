import React, { createContext, useContext } from 'react';

const AdContext = createContext(null);
const API_URL = 'http://127.0.0.1:8000/api';

export const AdProvider = ({ children }) => {
    
    const createCarAd = async (formData) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated.');

        // We are sending files, so we MUST use FormData, not JSON.
        const response = await fetch(`${API_URL}/car-ads`, {
            method: 'POST',
            headers: {
                // DO NOT set Content-Type; the browser will set it automatically with the correct boundary for FormData.
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            let errorMessage = result.message || 'Failed to create ad.';
            if (result.errors) {
                errorMessage = Object.values(result.errors).flat().join('\n');
            }
            throw new Error(errorMessage);
        }

        return result;
    };

    return (
        <AdContext.Provider value={{ createCarAd }}>
            {children}
        </AdContext.Provider>
    );
};

export const useAds = () => {
    return useContext(AdContext);
};