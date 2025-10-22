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



     /**
     * Fetches the full details of a single pending update.
     */
    const getPendingUpdateById = async (pendingUpdateId) => {
        const response = await api.get(`/admin/pending-updates/${pendingUpdateId}`);
        // A single resource is wrapped in a 'data' key
        return response.data.data;
    };




    /**
     * Fetches the list of all users for the admin panel.
     */
    const getAllUsers = useCallback(async () => {
        const response = await api.get('/admin/users');
        // A paginated resource collection is wrapped in a 'data' key
        return response.data.data;
    }, []);


    /**
     * Deletes a user by their ID.
     */
    const deleteUser = useCallback(async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    }, []);



    const value = {
        pendingUpdates,
        isLoading,
        error,
        getPendingUpdates,
        approveUpdate,
        rejectUpdate,
        getPendingUpdateById,
        getAllUsers,
        deleteUser,
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