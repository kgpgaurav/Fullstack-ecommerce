import axios from "axios";

// Determine the base URL based on environment
const getBaseURL = () => {
    // Check if we're in development
    if (import.meta.env.MODE === "development") {
        return "http://localhost:3000/api";
    }
    
    // For production, check if we have a separate backend URL
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    
    // Default to same domain (combined deployment)
    return "/api";
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true, //send cookies to server
    timeout: 10000, // 10 second timeout
})

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('Response Error:', error.response?.status, error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance