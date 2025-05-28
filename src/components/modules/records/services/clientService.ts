import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Configuración de Axios para interceptor el token
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Puedes redirigir al login o manejar el error como prefieras
            console.error("Sesión expirada o no autorizado");
        }
        // Usa ?? en vez de || para el mensaje de error
        return Promise.reject(error instanceof Error ? error : new Error(error?.message ?? "Error desconocido"));
    }
);

export interface Client {
    id?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    id_empresa: any; // Para el objeto vacío {}
}

// Obtener todos los clientes
export const getClients = async (): Promise<Client[]> => {
    try {
        const response = await api.get("/clientes");
        return response.data.map((client: any) => ({
            ...client,
            id: client.id_cliente ?? client.id, // Usa nullish coalescing
        }));
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

// Crear un cliente
export const createClient = async (client: Omit<Client, "id">): Promise<Client> => {
    try {
        const response = await api.post("/clientes", client);
        return response.data;
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
};

// Actualizar un cliente
export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
    try {
        const response = await api.patch(`/clientes/${id}`, client);
        return response.data;
    } catch (error) {
        console.error("Error updating client:", error);
        throw error;
    }
};

// Eliminar un cliente
export const deleteClient = async (id: string): Promise<void> => {
    try {
        await api.delete(`/clientes/${id}`);
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
};
