import api from "../api";

export interface Category {
    id?: string;
    nombre: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get("/categorias");
    return response.data.map((cat: any) => ({
        id: cat.id_categoria,  // mapea correctamente
        nombre: cat.nombre
    }));
};

export const getCategoryById = async (id: string): Promise<Category> => {
    const response = await api.get(`/categorias/${id}`);
    const cat = response.data;
    return {
        id: cat.id_categoria,
        nombre: cat.nombre
    };
};

export const createCategory = async (category: Omit<Category, "id">): Promise<Category> => {
    const response = await api.post("/categorias", category);
    const cat = response.data;
    return {
        id: cat.id_categoria,
        nombre: cat.nombre
    };
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
    const response = await api.patch(`/categorias/${id}`, {
        nombre: category.nombre,
        id_categoria: id
    });
    const cat = response.data;
    return {
        id: cat.id_categoria,
        nombre: cat.nombre
    };
};


export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await api.delete(`/categorias/${id}`);
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};