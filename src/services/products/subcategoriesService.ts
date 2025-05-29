import api from "../api";

export interface Subcategory {
    id?: string;
    nombre: string;
    id_categoria: string | { id_categoria: string; nombre?: string }; // Acepta string u objeto
}

export const getSubcategories = async (): Promise<Subcategory[]> => {
    const response = await api.get("/subcategorias");
    return response.data.map((sub: any) => ({
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: typeof sub.id_categoria === 'object'
            ? sub.id_categoria.id_categoria
            : sub.id_categoria
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
    const response = await api.post("/subcategorias", subcategory);
    const sub = response.data;
    return {
        id: sub.id_subcategoria,
        nombre: sub.nombre,
        id_categoria: sub.id_categoria
    };
};

export const updateSubcategory = async (id: string, subcategory: Partial<Subcategory>): Promise<Subcategory> => {
    const response = await api.patch(`/subcategorias/${id}`, {
        ...subcategory,
        id_subcategoria: id
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
