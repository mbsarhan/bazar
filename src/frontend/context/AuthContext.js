import React, { createContext, useState, useContext, useEffect } from 'react';

// The URL of your Laravel API backend
const API_URL = 'http://127.0.0.1:8000/api';

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
                    const response = await fetch(`${API_URL}/user`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        // This happens if the token is old or invalid
                        throw new Error('Invalid session, please log in again.');
                    }

                    const userData = await response.json();
                    setUser(userData); // Set the user in our state

                } catch (error) {
                    console.error("Auto-login failed:", error);
                    // If the token is bad, log the user out
                    logout();
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
        // Your form uses 'credential', but our API expects 'email'
        const loginPayload = {
            email: credentials.credential,
            password: credentials.password
        };

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginPayload),
        });

        const result = await response.json();

        if (!response.ok) {
            // If the API returns an error (e.g., wrong password),
            // throw an error so the Login.js component can display it.
            throw new Error(result.message || 'Login failed.');
        }

        // --- On Success ---
        setUser(result.user); // Set the user data
        setToken(result.access_token); // Set the token in our state
        localStorage.setItem('authToken', result.access_token); // Save the token to local storage
    };

    /**
     * The NEW logout function.
     * It calls the API to invalidate the token on the server,
     * then cleans up the client-side state.
     */
    const logout = async () => {
        // We need the token to tell the server which session to end.
        const currentToken = localStorage.getItem('authToken');
        
        // If for some reason there's no token, just clean up and exit.
        if (!currentToken) {
            setUser(null);
            setToken(null);
            return;
        }

        try {
            // Make the POST request to the /api/logout endpoint
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    // This is the most important part: sending the user's token
                    'Authorization': `Bearer ${currentToken}`,
                },
            });

        } catch (error) {
            console.error("API logout failed, but logging out locally anyway:", error);
        } finally {
            // This 'finally' block runs whether the API call succeeds or fails.
            // This ensures the user is always logged out on the frontend.
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken');
        }
    };

    // Make sure the rest of your file (like the 'value' object and return statement) is correct.
// The 'value' object should look like this:
const value = {
    user,
    token,
    login,
    logout, // The new async logout function
    isDashboardCollapsed,
    setIsDashboardCollapsed
};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This hook remains the same
export const useAuth = () => {
    return useContext(AuthContext);
};