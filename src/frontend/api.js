import axios from 'axios';

// 1. Create a new Axios instance with a custom configuration
const api = axios.create({
    // Set the base URL for all API requests
    baseURL: 'https://dayyelha.onrender.com',
    // Set default headers for all requests
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// 2. Add a request interceptor (This is the magic part!)
// This function will run BEFORE every single request is sent.
api.interceptors.request.use(
    config => {
        // Get the authentication token from local storage
        const token = localStorage.getItem('authToken');

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Must return the config object, otherwise the request will be blocked
        return config;
    },
    error => {
        // Handle request errors (e.g., network issues)
        return Promise.reject(error);
    }
);

// (Optional but Recommended) Add a response interceptor for global error handling
api.interceptors.response.use(
    response => response, // Simply return the response if it's successful
    async error => {
        if (error.response && error.response.status === 401) {
            // If we get a 401 Unauthorized error, the token is invalid or expired.
            // Automatically log the user out and redirect them to the login page.
            console.error("Unauthorized session. Logging out.");
            localStorage.removeItem('authToken');
            // Redirect to login page, preventing a redirect loop
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        // Return the error so that the component's .catch() block can handle it
        return Promise.reject(error);
    }
);


export default api;