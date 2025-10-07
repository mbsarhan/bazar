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
    /**
     * NEW FUNCTION: Fetches the car ads for the logged-in user.
     */
    const getMyCarAds = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated.');

        const response = await fetch(`${API_URL}/user/car-ads`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch ads.');
        }

        // The API now returns a 'data' key because we used a Resource Collection
        return result.data;
    };
    const getAdById = async (adId) => {


        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated.');


        const response = await fetch(`${API_URL}/car-ads/${adId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch the ad.');
        }

        // The API now returns a 'data' key because we used a Resource Collection
        return result.data;
    }
    /**
     * NEW FUNCTION: Deletes a specific car ad by its ID.
     */
    const deleteCarAd = async (adId) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('User not authenticated.');

        // The endpoint is now DELETE /api/car-ads/{adId}
        const response = await fetch(`${API_URL}/car-ads/${adId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            // This will catch errors, including the 403 Forbidden error from the policy
            throw new Error(result.message || 'Failed to delete ad.');
        }

        return result;
    };


     // Add the new function to the provider's value
    return (
        <AdContext.Provider value={{ createCarAd ,getMyCarAds ,deleteCarAd ,getAdById}}>
            {children}
        </AdContext.Provider>
    );
};

export const useAds = () => {
    return useContext(AdContext);
};