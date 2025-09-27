// src/frontend/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    // --- 1. Add the collapsed state here ---
    const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);

    const login = (userData) => {
        const fakeUser = { name: 'اسم المستخدم', email: userData.credential };
        localStorage.setItem('user', JSON.stringify(fakeUser));
        setUser(fakeUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // --- 2. Expose the new state and its setter function ---
    const value = { user, login, logout, isDashboardCollapsed, setIsDashboardCollapsed };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};