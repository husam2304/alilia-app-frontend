// src/services/api.js
import axios from 'axios';

const API_CONFIG = {
    BASE_URL: "api",

};

// Create axios instance
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response, // Directly return successful responses.
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
            try {
                const refreshToken = localStorage.getItem('refreshToken'); // Retrieve the stored refresh token.
                // Make a request to your auth server to refresh the token.
                const response = await axios.post(`${API_CONFIG.BASE_URL}/Auth/refresh-token/${refreshToken}`);
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                // Store the new access and refresh tokens.
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                // Update the authorization header with the new access token.
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest); // Retry the original request with the new access token.
            } catch (refreshError) {
                // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error); // For all other errors, return the error as is.
    }
);
export default api;