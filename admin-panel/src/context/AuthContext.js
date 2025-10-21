// admin-panel/src/context/AuthContext.js (Simplified for UI Prototyping)
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State now just holds a fake admin object or null
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminAuthToken'));
    
    // --- THIS IS THE KEY ---
    const [isLoading, setIsLoading] = useState(true); // Start in a loading state

    useEffect(() => {
        const fetchAdminData = async () => {
            if (token) {
                try {
                    // In a real app, you would fetch the user here
                    // const response = await api.get('/admin/user');
                    // setAdmin(response.data);
                    
                    // --- SIMULATION ---
                    // For now, if a token exists, we assume it's a valid admin
                    setAdmin({ name: 'Admin User', email: 'admin@example.com', is_admin: true });

                } catch (error) {
                    console.error("Auto-login failed:", error);
                    logout(); // If token is bad, log them out
                }
            }
            // Whether there was a token or not, the initial check is complete.
            setIsLoading(false);
        };

        fetchAdminData();
    }, [token]); // This hook runs only when the token changes

    // A simple, instant login function
    const login = (credentials) => {
        // --- THIS IS THE FIX ---
        // We've changed the password to something less common
        if (credentials.email === 'admin@example.com' && credentials.password === 'AdminPassword123!') {
            const fakeAdmin = { name: 'Admin', email: 'admin@example.com', is_admin: true };
            localStorage.setItem('adminAuthToken', 'fake-admin-token-123');
            setAdmin(fakeAdmin);
            return Promise.resolve(fakeAdmin);
        }
        return Promise.reject(new Error('Invalid credentials'));
    };

    // A simple, instant logout function
    const logout = () => {
        localStorage.removeItem('adminAuthToken');
        setAdmin(null);
    };

    const value = useMemo(() => ({
        admin,
        token,
        isLoading, // Expose the loading state
        login,
        logout,
    }), [admin, token, isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};