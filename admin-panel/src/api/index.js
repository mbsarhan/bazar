// admin-panel/src/api/index.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dayyelha.onrender.com/api/admin',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    withCredentials: true,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('adminAuthToken'); // Use the admin token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export default api;