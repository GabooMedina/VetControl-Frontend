import api from "../api";

export interface Subcategory {
    id?: string;
    nombre: string;
    id_categoria: string | { id_categoria: string; nombre?: string };
}

export const getSubcategories = async (): Promise<Subcategory[]> => {
    const response = await api.get("/subcategorias");
    console.log("Subcategorías del backend:", response.data); // Para debug
    return response.data.map((sub: any) => ({
        // Usar id_subcategoria según la estructura de tu API
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: sub.id_categoria
    }));
};

export const getSubcategoryById = async (id: string): Promise<Subcategory> => {
    const response = await api.get(`/subcategorias/${id}`);
    const sub = response.data;
    return {
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: sub.id_categoria
    };
};

export const createSubcategory = async (subcategory: Omit<Subcategory, "id">): Promise<Subcategory> => {
    const response = await api.post("/subcategorias", {
        nombre: subcategory.nombre,
        id_categoria: typeof subcategory.id_categoria === 'object'
            ? subcategory.id_categoria.id_categoria
            : subcategory.id_categoria
    });
    const sub = response.data;
    return {
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: sub.id_categoria
    };
};

export const updateSubcategory = async (id: string, subcategory: Partial<Subcategory>): Promise<Subcategory> => {
    const response = await api.patch(`/subcategorias/${id}`, {
        nombre: subcategory.nombre,
        id_categoria: typeof subcategory.id_categoria === 'object'
            ? subcategory.id_categoria.id_categoria
            : subcategory.id_categoria
    });
    const sub = response.data;
    return {
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: sub.id_categoria
    };
};

export const deleteSubcategory = async (id: string): Promise<void> => {
    await api.delete(`/subcategorias/${id}`);
};