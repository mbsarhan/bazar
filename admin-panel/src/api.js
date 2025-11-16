import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dayyelha.onrender.com/api/admin', // Your Laravel API URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor to automatically add the Auth Token
api.interceptors.request.use(
    config => {
        // NOTE: The admin panel will get its token from its own localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default api;