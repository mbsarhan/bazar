import React, { createContext, useContext } from 'react';
import api from '../api'; // Your central axios client

const PasswordResetContext = createContext(null);

export const PasswordResetProvider = ({ children }) => {
    
    // Step 1: Request a reset code
    const sendResetCode = async (email) => {
        const response = await api.post('/forgot-password', { email });
        return response.data;
    };
    
    // Step 2: Verify the reset code
    const verifyResetCode = async (email, code) => {
        const response = await api.post('/verify-password-reset-code', { email, code });
        return response.data;
    };
    
    // Step 3: Set the new password
    const resetPassword = async (email, code, password, password_confirmation) => {
        const response = await api.post('/reset-password', {
            email,
            code,
            password,
            password_confirmation,
        });
        return response.data;
    };

    const value = { 
        sendResetCode,
        verifyResetCode,
        resetPassword
    };

    return (
        <PasswordResetContext.Provider value={value}>
            {children}
        </PasswordResetContext.Provider>
    );
};

export const usePasswordReset = () => {
    return useContext(PasswordResetContext);
};