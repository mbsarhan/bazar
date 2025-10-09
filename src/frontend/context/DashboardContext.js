import React, { createContext, useContext } from 'react';
import api from '../api'; // Use our central axios client

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    
    /**
     * Fetches the aggregated statistics for the dashboard overview.
     */
    const getDashboardStats = async () => {
        // The axios client automatically adds the auth token.
        const response = await api.get('/dashboard/statistics');
        // The API returns the data directly, not wrapped in a 'data' key this time.
        return response.data;
    };

    const value = {
        getDashboardStats,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    return useContext(DashboardContext);
};