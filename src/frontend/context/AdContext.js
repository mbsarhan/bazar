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
     * Fetches the car ads for the logged-in user, with optional filters.
     * @param {object} filters - e.g., { status: 'فعال' }
     */
    const getMyCarAds = async (filters = {}) => {
        // The axios client adds the token and uses 'params' to create the query string
        const response = await api.get('/user/car-ads', {
            params: filters
        });
        return response.data.data;
    };
    /**
     * NEW UNIFIED FUNCTION: Fetches any ad by its ID from the public endpoint.
     */
    const getAdById = async (adId) => {
        // This is a public call, so no token is sent.
        // We use the new, generalized endpoint.
        const response = await api.get(`/advertisements/${adId}`);
        // The resource wraps the response in a 'data' key.
        return response.data.data;
    };
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
     * Fetches the Real-Estate ads for the logged-in user, with optional filters.
     * @param {object} filters - e.g., { status: 'فعال' }
     */
    const getMyRealEstateAds = async (filters = {}) => {
        // The axios client adds the token and uses 'params' to create the query string
        const response = await api.get('/user/realestate-ads', {
            params: filters
        });
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
     * Fetches the public list of ads, with optional filters.
     * @param {object} filters - e.g., { type: 'car' }
     */
    const getPublicAds = async (filters = {}) => {
        try {
            const response = await api.get('/advertisements', {
                params: filters // Axios will create the URL: /advertisements?type=car&page=1&limit=24
            });

            // The API now returns a structured object, not just the data array.
            // We need to extract both the data and the total pages from it.
            const responseData = response.data;

            // A standard paginated response from a framework like Laravel looks like this.
            // Adjust the paths (e.g., `responseData.meta.last_page`) if your API structure is different.
            return {
                data: responseData.data, // The array of ads for the current page
                totalPages: responseData.meta.last_page, // The total number of pages available
            };

        } catch (error) {
            console.error("Error in getPublicAds:", error);
            // Throw a clear error message that the component can catch and display.
            throw new Error(error.response?.data?.message || "Failed to fetch advertisements.");
        }
    };

    /**
     * NEW: Increments the view count for an ad.
     * This function will be awaited in the component.
     */
    const incrementAdView = async (adId) => {
        try {
            // The 'api' client automatically handles the auth token if the user is logged in.
            // If the user is a guest, no token is sent, which is what our backend expects.
            await api.post(`/advertisements/${adId}/view`);
        } catch (error) {
            // We log the error here for debugging but don't re-throw it.
            // We don't want a failed view count to stop the user from navigating.
            console.error("Failed to increment ad view count:", error);
        }
    };



    /**
     * NEW: Updates a specific car ad.
     * @param {string} adId - The ID of the ad to update.
     * @param {FormData} adData - The form data including _method=PUT.
     */
    const updateCarAd = async (adId, adData) => {
        // Use POST for multipart/form-data, Laravel will handle the PUT method.
        const response = await api.post(`/car-ads/${adId}`, adData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    };


    /**
     * NEW: Updates a specific Real Estate Ad.
     */
    const updateRealEstateAd = async (adId, adData) => {
        const response = await api.post(`/realestate-ads/${adId}`, adData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    };


    // Add the new function to the provider's value
    return (
        <AdContext.Provider value={{ createCarAd, getMyCarAds, deleteCarAd, getAdById, createRealEstateAd, getMyRealEstateAds, deleteRealEstateAd, getPublicAds, incrementAdView, updateCarAd, updateRealEstateAd }}>
            {children}
        </AdContext.Provider>
    );
};

export const useAds = () => {
    return useContext(AdContext);
};