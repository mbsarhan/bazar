import React, { createContext, useContext, useCallback } from 'react';
import api from '../api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    
    const getUserReviews = useCallback(async () => {
        try {
            const response = await api.get('/user/reviews');
            return response.data;
        } catch (error) {
            // It's good practice to handle potential errors here
            console.error("Failed to fetch user's reviews:", error);
            // Re-throw the error so the component can catch it and set an error message
            throw new Error('فشل تحميل التقييمات.');
        }
    }, []);

    const getPublicProfile = async (userId) => {
        // The axios client automatically sends a token if one exists (for the security check).
        // If the user is a guest, no token is sent.
        const response = await api.get(`/users/${userId}/public-profile`);
        return response.data;
    };


    /**
     * NEW: Submits a rating for a specific user.
     * @param {object} ratingData - { rated_user_id, rating, message }
     */
    const rateUser = async (ratingData) => {
        // The axios client automatically adds the auth token for this protected route.
        const response = await api.post('/users/rate', ratingData);
        return response.data; // Return the success message and new average
    };

    const value = { getUserReviews, getPublicProfile, rateUser};

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};