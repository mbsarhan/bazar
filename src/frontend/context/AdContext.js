import React, { createContext, useContext } from 'react';
import api from '../api'; // Use the central axios client

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

   /**
     * NEW: Creates a new Real Estate Ad using AXIOS.
     * @param {FormData} adFormData - The complete form data including files.
     */
    const createRealEstateAd = async (adFormData) => {
        // Our api.js client automatically adds the Auth token.
        // For file uploads with FormData, we must tell axios to set the correct multipart header.
        const response = await api.post('/realestate-ads', adFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        // Axios automatically provides the data in the .data property
        return response.data;
    };


    /**
     * NEW: Fetches the real estate ads for the logged-in user.
     */
    const getMyRealEstateAds = async () => {
        // The axios client automatically adds the auth token.
        const response = await api.get('/user/realestate-ads');
        // A resource collection is wrapped in a 'data' key by Laravel.
        return response.data.data;
    };


    /**
     * NEW: Deletes a specific Real Estate ad by its ID.
     */
    const deleteRealEstateAd = async (adId) => {
        // The axios client automatically adds the token and handles errors.
        const response = await api.delete(`/realestate-ads/${adId}`);
        return response.data; // Return the success message
    };



    /**
     * NEW: Fetches the public list of all active ads for the homepage.
     */
    const getPublicAds = async () => {
        // This is a public route, so no token is needed. We can use the 'api' client.
        const response = await api.get('/advertisements');
        // The paginated resource collection is wrapped in a 'data' key.
        return response.data.data;
    };


     // Add the new function to the provider's value
    return (
        <AdContext.Provider value={{ createCarAd ,getMyCarAds ,deleteCarAd ,getAdById ,createRealEstateAd ,getMyRealEstateAds ,deleteRealEstateAd ,getPublicAds}}>
            {children}
        </AdContext.Provider>
    );
};

export const useAds = () => {
    return useContext(AdContext);
};