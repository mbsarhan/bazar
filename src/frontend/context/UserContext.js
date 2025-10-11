import React, { createContext, useContext } from 'react';
import api from '../api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    
    const getUserReviews = async () => {
        const response = await api.get('/user/reviews');
        return response.data;
    };

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