import api from "../api";

export interface Inventory {
    id?: string;
    nombre: string;
    descripcion: string;
    precio_unitario: number;
    subcategoriaId: string | { id_subcategoria: string; nombre?: string } | null;
    id_empresa: string | { id_empresa: string; nombre?: string };
}

export const getInventories = async (): Promise<Inventory[]> => {
    const response = await api.get("/productos");
    console.log("Datos del backend:", response.data);
    return response.data.map((prod: any) => ({
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.id_subcategoria,
        id_empresa: prod.id_empresa
    }));
};

export const getInventoryById = async (id: string): Promise<Inventory> => {
    const response = await api.get(`/productos/${id}`);
    const prod = response.data;
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.id_subcategoria?.id_subcategoria || prod.id_subcategoria || null,
        id_empresa: prod.id_empresa?.id_empresa || prod.id_empresa || ""
    };
};

export const createInventory = async (product: Omit<Inventory, "id">): Promise<Inventory> => {
    const payload: any = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio_unitario: product.precio_unitario,
        // Según tu API, necesitas enviar id_empresa como string directo
        id_empresa: typeof product.id_empresa === 'object'
            ? product.id_empresa.id_empresa
            : product.id_empresa
    };

    // Solo incluir id_subcategoria si hay una subcategoría seleccionada
    if (product.subcategoriaId && product.subcategoriaId !== "" && product.subcategoriaId !== null) {
        payload.id_subcategoria = typeof product.subcategoriaId === 'object'
            ? product.subcategoriaId.id_subcategoria
            : product.subcategoriaId;
    }
    // Si no hay subcategoría, no enviar el campo (tu API maneja null automáticamente)

    console.log("Payload CREATE:", payload);
    const response = await api.post("/productos", payload);
    const prod = response.data;
    
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.id_subcategoria,
        id_empresa: prod.id_empresa
    };
};

export const updateInventory = async (id: string, product: Partial<Inventory>): Promise<Inventory> => {
    const payload: any = {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio_unitario: product.precio_unitario,
        // Según tu API, necesitas enviar id_empresa como string directo
        id_empresa: typeof product.id_empresa === 'object'
            ? product.id_empresa.id_empresa
            : product.id_empresa
    };

    // Solo incluir id_subcategoria si hay una subcategoría seleccionada
    if (product.subcategoriaId && product.subcategoriaId !== "" && product.subcategoriaId !== null) {
        payload.id_subcategoria = typeof product.subcategoriaId === 'object'
            ? product.subcategoriaId?.id_subcategoria
            : product.subcategoriaId;
    }
    // Si no hay subcategoría, no enviar el campo

    console.log("Payload UPDATE:", payload);
    const response = await api.patch(`/productos/${id}`, payload);
    const prod = response.data;
    
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.id_subcategoria,
        id_empresa: prod.id_empresa
    };
};

export const deleteInventory = async (id: string): Promise<void> => {
    await api.delete(`/productos/${id}`);
};