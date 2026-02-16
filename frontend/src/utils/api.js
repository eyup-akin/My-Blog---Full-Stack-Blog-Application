import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, // Cookies (token) gönderimi için
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            // Opsiyonel: Kullanıcıyı login sayfasına yönlendir veya logout yap
            // window.location.href = '/login'; // Bunu AuthContext içinde yönetmek daha iyi
        }
        return Promise.reject(error);
    }
);

let token = localStorage.getItem('token');

export const setAuthToken = (newToken) => {
    token = newToken;
    if (newToken) {
        localStorage.setItem('token', newToken);
    } else {
        localStorage.removeItem('token');
    }
};

api.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
