import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para Añadir el token a las solicitudes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para Manejar errores de Autenticación
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error("Sesión expirada o no autorizado");
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
