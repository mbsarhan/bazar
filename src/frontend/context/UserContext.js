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

    const value = { getUserReviews };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};