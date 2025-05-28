import api from "../api";

// Interfaces para los tipos de datos
interface ApiMedicalHistory {
    id_historial: string;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    notas: string;
    id_mascota: {
        id_mascota: string;
    };
}

interface ApiPet {
    id_mascota: string;
    nombre: string;
    [key: string]: any; // Para propiedades adicionales
}

interface PetForSelect {
    value: string;
    label: string;
}

export interface MedicalHistory {
    id?: string;
    fecha: string;
    diagnostico: string;
    tratamiento: string;
    notas: string;
    id_mascota: {
        id_mascota: string;
        nombre?: string;
    };
}

export const getMedicalHistories = async (): Promise<MedicalHistory[]> => {
    try {
        const [historiesResponse, petsResponse] = await Promise.all([
            api.get<ApiMedicalHistory[]>("/historiales-medicos"),
            api.get<ApiPet[]>("/mascotas")
        ]);

        // Verificar si hay datos válidos
        if (!historiesResponse.data || !Array.isArray(historiesResponse.data)) {
            throw new Error("Formato de respuesta de historiales inválido");
        }

        if (!petsResponse.data || !Array.isArray(petsResponse.data)) {
            throw new Error("Formato de respuesta de mascotas inválido");
        }

        // Crear mapa de mascotas con validación
        const petsMap = new Map<string, ApiPet>();
        petsResponse.data.forEach((pet: ApiPet) => {
            if (pet?.id_mascota) {
                petsMap.set(pet.id_mascota, pet);
            }
        });

        // Procesar historiales con validación
        return historiesResponse.data.map((history: ApiMedicalHistory) => {
            // Manejo seguro de id_mascota
            const mascotaId = history?.id_mascota?.id_mascota;

            if (!mascotaId) {
                console.warn(`Historial ${history.id_historial} no tiene mascota asociada`);
                return {
                    ...history,
                    id: history.id_historial,
                    id_mascota: {
                        id_mascota: '',
                        nombre: 'Sin mascota'
                    }
                };
            }

            const pet = petsMap.get(mascotaId);

            return {
                ...history,
                id: history.id_historial,
                id_mascota: {
                    id_mascota: mascotaId,
                    nombre: pet?.nombre || 'Mascota no encontrada'
                }
            };
        });
    } catch (error) {
        console.error("Error fetching medical histories:", error);
        throw error;
    }
};

export const createMedicalHistory = async (history: Omit<MedicalHistory, "id">): Promise<MedicalHistory> => {
    try {
        const historyToSend = {
            ...history,
            id_mascota: {
                id_mascota: history.id_mascota.id_mascota
            }
        };

        const response = await api.post<ApiMedicalHistory>("/historiales-medicos", historyToSend);

        return {
            ...response.data,
            id: response.data.id_historial,
            id_mascota: {
                id_mascota: response.data.id_mascota.id_mascota,
                nombre: history.id_mascota.nombre
            }
        };
    } catch (error) {
        console.error("Error creating medical history:", error);
        throw error;
    }
};

export const updateMedicalHistory = async (id: string, history: Partial<MedicalHistory>): Promise<MedicalHistory> => {
    try {
        const historyToSend = {
            ...history,
            id_mascota: history.id_mascota ? {
                id_mascota: history.id_mascota.id_mascota
            } : undefined
        };

        const response = await api.patch<ApiMedicalHistory>(`/historiales-medicos/${id}`, historyToSend);

        return {
            ...response.data,
            id: response.data.id_historial,
            id_mascota: {
                id_mascota: response.data.id_mascota.id_mascota,
                nombre: history.id_mascota?.nombre
            }
        };
    } catch (error) {
        console.error("Error updating medical history:", error);
        throw error;
    }
};

export const deleteMedicalHistory = async (id: string): Promise<void> => {
    try {
        await api.delete(`/historiales-medicos/${id}`);
    } catch (error) {
        console.error("Error deleting medical history:", error);
        throw error;
    }
};

export const getPetsForSelect = async (): Promise<PetForSelect[]> => {
    try {
        const response = await api.get<ApiPet[]>("/mascotas");
        return response.data.map((pet: ApiPet) => ({
            value: pet.id_mascota,
            label: pet.nombre
        }));
    } catch (error) {
        console.error("Error fetching pets for select:", error);
        return [];
    }
};