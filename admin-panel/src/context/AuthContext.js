// admin-panel/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import api from '../api'; // We will create this file next

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('adminAuthToken'));
    const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    // The interceptor in api.js will automatically add the token
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth token is invalid, logging out:", error);
                    logout(); // The token is bad, so we clear it
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserData();
        } else {
            setIsLoading(false); // No token, so we're done loading
        }
    }, [token]); // This hook runs only when the token state changes

    const login = useCallback(async (credentials) => {
        try {
            // IMPORTANT: Use a dedicated admin login route
            const response = await api.post('/admin/login', credentials);
            const { user, access_token } = response.data;

            setUser(user);

            setToken(access_token);
            localStorage.setItem('adminAuthToken', access_token);
        } catch (error) {
            // Re-throw the error so the login form can display it
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        // We'll make this an async function if you have an API logout endpoint
        console.log("Logging out...");
        setUser(null);
        setToken(null);
        localStorage.removeItem('adminAuthToken');
    }, []);

    const value = useMemo(() => ({
        user,
        token,
        isLoading,
        login,
        logout,
    }), [user, token, isLoading, login, logout]);

    // Render children only after the initial loading is complete
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};