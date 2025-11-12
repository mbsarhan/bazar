// src/frontend/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    // --- 1. NEW: Add a loading state, initially true ---
    const [isLoading, setIsLoading] = useState(true);
    const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await api.get('/user');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auto-login failed, removing token:", error);
                    // If the token is invalid, clear it out
                    setToken(null);
                    localStorage.removeItem('authToken');
                }
            }
            // --- 2. CRITICAL: Set loading to false AFTER the check is complete ---
            setIsLoading(false);
        };

        fetchUserData();
    }, [token]); // This hook still runs when the token changes

    const login = async (credentials) => {
        const loginPayload = { credential: credentials.credential, password: credentials.password };
        const response = await api.post('/login', loginPayload);
        setUser(response.data.user);
        setToken(response.data.access_token);
        localStorage.setItem('authToken', response.data.access_token);
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("API logout failed, but logging out locally anyway.", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
        }
    };

    // ... (All your other functions like verifyPassword, updateProfile, etc., remain exactly the same)
    const verifyPassword = async (password) => {
        const response = await api.post('/user/verify-password', { password });
        return response.data;
    };
    const updatePassword = async (passwordData) => {
        const response = await api.post('/user/password', passwordData);
        return response.data;
    };
    const updateProfile = async (profileData) => {
        const response = await api.put('/user/profile', profileData);
        setUser(response.data);
        return response.data;
    };
    const requestEmailChange = async (newEmail) => {
        const response = await api.post('/user/email/request-change', { email: newEmail });
        return response.data;
    };
    const verifyEmailChange = async (code) => {
        const response = await api.post('/user/email/verify-change', { code });
        const userResponse = await api.get('/user');
        setUser(userResponse.data);
        return response.data;
    };
    const verifyAccountOtp = async (email, code) => {
        const response = await api.post('/email/verify-otp', { email, code });
        return response.data;
    };
    const resendAccountOtp = async (email) => {
        const response = await api.post('/email/verify-otp/resend', { email });
        return response.data;
    };


    const value = {
        user,
        token,
        // --- 3. NEW: Expose the loading state to the rest of the app ---
        isLoading,
        verifyAccountOtp,
        resendAccountOtp,
        login,
        logout,
        verifyPassword,
        updatePassword,
        updateProfile,
        requestEmailChange,
        verifyEmailChange,
        isDashboardCollapsed,
        setIsDashboardCollapsed
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};