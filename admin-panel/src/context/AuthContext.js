import React, { useState, createContext, useContext, useEffect } from 'react';
import api from '../api'; // The admin panel's axios client

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State will hold the admin user object or null
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoggedInAdmin = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const response = await api.get('/user');
                    // --- THIS IS THE FIX ---
                    // Check for the 'is_admin' property from the Laravel User model.
                    if (response.data && response.data.admin == 1) {
                        setUser(response.data);
                    } else {
                        localStorage.removeItem('authToken');
                    }
                } catch (error) {
                    localStorage.removeItem('authToken');
                }
            }
            setIsLoading(false);
        };
        checkLoggedInAdmin();
    }, []);

    const login = async (credentials) => {
        const response = await api.post('/login', credentials);
        
        const loggedInUser = response.data.user;
        const token = response.data.access_token;

        // --- THIS IS THE CRITICAL FIX ---
        // We must check for the property that the API actually sends: `is_admin`.
        if (loggedInUser && loggedInUser.admin == 1) {
            localStorage.setItem('authToken', token);
            setUser(loggedInUser);
        } else {
            // This is the error you are seeing.
            throw new Error('Access Denied: You do not have administrative privileges.');
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        // We can also call the API to invalidate the token on the server
        api.post('/logout').catch(err => console.error("Logout API call failed:", err));
    };

    const value = { user, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};