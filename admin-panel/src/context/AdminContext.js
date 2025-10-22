import React, { createContext, useState, useContext , useCallback } from 'react';
import api from '../api'; // Your central axios client

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    const [pendingUpdates, setPendingUpdates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

   
    const getPendingUpdates = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/pending-updates');
            setPendingUpdates(response.data.data);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch pending updates.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []); // 3. The dependency array for useCallback is empty because it has no external dependencies

   /**
     * Approves a specific pending update by its ID.
     */
    const approveUpdate = useCallback(async (pendingUpdateId) => {
        const response = await api.post(`/admin/pending-updates/${pendingUpdateId}/approve`);
        setPendingUpdates(prev => prev.filter(update => update.id !== pendingUpdateId));
        return response.data;
    }, []); // Also wrap this function for consistenc

    /**
     * Rejects a specific pending update by its ID.
     */
    const rejectUpdate = useCallback(async (pendingUpdateId) => {
        const response = await api.post(`/admin/pending-updates/${pendingUpdateId}/reject`);
        setPendingUpdates(prev => prev.filter(update => update.id !== pendingUpdateId));
        return response.data;
    }, []); // And this one too

    const value = {
        pendingUpdates,
        isLoading,
        error,
        getPendingUpdates,
        approveUpdate,
        rejectUpdate,
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    return useContext(AdminContext);
};