import api from "../api";

export interface Client {
    id?: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    direccion: string;
    id_empresa: Record<string, never> | any;
}

export const getClients = async (): Promise<Client[]> => {
    try {
        const response = await api.get("/clientes");
        return response.data.map((client: any) => ({
            ...client,
            id: client.id_cliente,
        }));
    } catch (error) {
        console.error("Error fetching clients:", error);
        throw error;
    }
};

export const createClient = async (client: Omit<Client, "id">): Promise<Client> => {
    try {
        const response = await api.post("/clientes", client);
        return response.data;
    } catch (error) {
        console.error("Error creating client:", error);
        throw error;
    }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
    try {
        const response = await api.patch(`/clientes/${id}`, client);
        return response.data;
    } catch (error) {
        console.error("Error updating client:", error);
        throw error;
    }
};

export const deleteClient = async (id: string): Promise<void> => {
    try {
        await api.delete(`/clientes/${id}`);
    } catch (error) {
        console.error("Error deleting client:", error);
        throw error;
    }
};
