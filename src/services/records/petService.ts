import api from "../api";

export interface Pet {
    id?: string;
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    fecha_nacimiento: string;
    color: string;
    id_cliente: string | { id_cliente: string } | null;
}

export const getPets = async (): Promise<Pet[]> => {
    try {
        const response = await api.get("/mascotas");
        return response.data.map((pet: any) => {
            let idCliente: string | null = null;

            if (pet.id_cliente !== null && pet.id_cliente !== undefined) {
                idCliente = typeof pet.id_cliente === 'string'
                    ? pet.id_cliente
                    : pet.id_cliente.id_cliente;
            }

            return {
                ...pet,
                id: pet.id_mascota || pet.id,
                id_cliente: idCliente
            };
        });
    } catch (error) {
        console.error("Error fetching pets:", error);
        throw error;
    }
};

export const createPet = async (pet: Omit<Pet, "id">): Promise<Pet> => {
    try {
        const petToSend = {
            ...pet,
            id_cliente: pet.id_cliente ? pet.id_cliente : undefined
        };
        const response = await api.post("/mascotas", petToSend);
        return {
            ...response.data,
            id: response.data.id_mascota,
            id_cliente: pet.id_cliente
        };
    } catch (error) {
        console.error("Error creating pet:", error);
        throw error;
    }
};

export const updatePet = async (id: string, pet: Partial<Pet>): Promise<Pet> => {
    try {
        const response = await api.patch(`/mascotas/${id}`, pet);
        return {
            ...response.data,
            id: response.data.id_mascota,
            id_cliente: pet.id_cliente || null
        };
    } catch (error) {
        console.error("Error updating pet:", error);
        throw error;
    }
};

export const deletePet = async (id: string): Promise<void> => {
    try {
        await api.delete(`/mascotas/${id}`);
    } catch (error) {
        console.error("Error deleting pet:", error);
        throw error;
    }
};

// Opcional: Para obtener clientes y mostrarlos en un select
export const getClientsForSelect = async (clientsData?: any[]): Promise<Array<{ value: string, label: string }>> => {
    try {
        const clients = clientsData || (await api.get("/clientes")).data;
        return clients.map((client: any) => ({
            value: client.id_cliente,
            label: `${client.nombre} ${client.apellido}`
        }));
    } catch (error) {
        console.error("Error fetching clients for select:", error);
        return [];
    }
};