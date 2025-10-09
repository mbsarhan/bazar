import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api'; // <-- 1. IMPORT OUR NEW AXIOS CLIENT

// The URL of your Laravel API backend

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // We will get the user object from the API, so it starts as null
    const [user, setUser] = useState(null);
    // The token is the key to knowing if the user is logged in
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    // --- Your existing UI state is preserved here ---
    const [isDashboardCollapsed, setIsDashboardCollapsed] = useState(false);

    // This hook runs when the app loads. It checks if there's a token
    // and uses it to fetch the user's data, keeping them logged in.
    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    // Use the axios client. The token is added automatically!
                    const response = await api.get('/user');
                    setUser(response.data);

                } catch (error) {
                    console.error("Auto-login failed:", error);
                }
            };
            fetchUserData();
        }
    }, [token]); // This hook re-runs only if the token changes

    /**
     * This is the NEW login function that calls the API.
     * It will be called from your Login.js component.
     */
    const login = async (credentials) => {
        const loginPayload = { credential: credentials.credential, password: credentials.password };
        // Use axios. The base URL is already set.
        const response = await api.post('/login', loginPayload);
        setUser(response.data.user);
        setToken(response.data.access_token);
        localStorage.setItem('authToken', response.data.access_token);
    };

    /**
     * The NEW logout function.
     * It calls the API to invalidate the token on the server,
     * then cleans up the client-side state.
     */
    const logout = async () => {
        try {
            // Use axios. The token is added automatically!
            await api.post('/logout');
        } catch (error) {
            console.error("API logout failed, but logging out locally anyway.", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
        }
    };

    // --- 2. ADD THE NEW FUNCTIONS FOR PASSWORD MANAGEMENT ---

    /**
     * Verifies the user's current password.
     */
    const verifyPassword = async (password) => {
        // The token is added automatically by the interceptor.
        const response = await api.post('/user/verify-password', { password });
        return response.data; // Return the success message
    };

    /**
     * Updates the user's password.
     */
    const updatePassword = async (passwordData) => {
        // passwordData will be { password, password_confirmation }
        const response = await api.post('/user/password', passwordData);
        return response.data; // Return the success message
    };


    /**
     * NEW: Updates the user's profile name.
     * @param {object} profileData - { fname, lname }
     */
    const updateProfile = async (profileData) => {
        // The axios client automatically adds the token.
        // We use api.put to match the PUT route we created.
        const response = await api.put('/user/profile', profileData);

        // --- CRITICAL STEP ---
        // On success, the API returns the full updated user object.
        // We update our central 'user' state with this new object.
        // This will automatically refresh the user's name everywhere in the app.
        setUser(response.data);

        // Return the response so the component knows it was successful.
        return response.data;
    };

    // Make sure the rest of your file (like the 'value' object and return statement) is correct.
// The 'value' object should look like this:
const value = {
    user,
    token,
    login,
    logout, // The new async logout function
    verifyPassword, // <-- 3. EXPOSE THE NEW FUNCTIONS
    updatePassword, // <-- ADD THIS
    updateProfile,
    isDashboardCollapsed,
    setIsDashboardCollapsed
};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This hook remains the same
export const useAuth = () => {
    return useContext(AuthContext);
};




///sadasdasdasdasdsadasd