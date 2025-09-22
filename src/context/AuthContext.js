// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // نحاول قراءة حالة المستخدم من التخزين المحلي عند بدء التشغيل
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const login = (userData) => {
        // في التطبيق الحقيقي، userData سيأتي من الخادم
        const fakeUser = { name: 'اسم المستخدم', email: userData.credential };
        localStorage.setItem('user', JSON.stringify(fakeUser));
        setUser(fakeUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook مخصص لتسهيل استخدام السياق
export const useAuth = () => {
    return useContext(AuthContext);
};