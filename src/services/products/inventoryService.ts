import api from "../api";
import { Subcategory } from "./subcategoriesService";

export interface Inventory {
    id?: string;
    nombre: string;
    descripcion: string;
    precio_unitario: number;
    subcategoriaId: string | { id_subcategoria: string; nombre?: string };
    id_empresa: string | { id_empresa: string; nombre?: string };
}

export const getInventories = async (
    subcategories: Subcategory[]
): Promise<Inventory[]> => {
    console.log("Subcategorías recibidas:", subcategories); // <- Agregar esto
    const response = await api.get("/productos");
    console.log("Respuesta del API (productos):", response.data); // <- Agregar esto

    const result = response.data.map((prod: any) => {
        const subcatId = prod.subcategoriaId?.id_subcategoria?.toString() || "";
        console.log(`Buscando subcategoría para ID: ${subcatId}`); // <- Agregar esto

        const subcat = subcategories.find(sc => {
            console.log(`Comparando con subcategoría ID: ${sc.id}, Tipo: ${typeof sc.id}`); // <- Agregar esto
            return sc.id?.toString() === subcatId;
        });

        console.log("Subcategoría encontrada:", subcat); // <- Agregar esto

        const empresaId = prod.id_empresa?.id_empresa?.toString() || "";

        return {
            id: prod.id_producto,
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            precio_unitario: prod.precio_unitario,
            subcategoriaId: {
                id_subcategoria: subcatId,
                nombre: subcat?.nombre || "Desconocido"
            },
            id_empresa: {
                id_empresa: empresaId,
                nombre: prod.id_empresa?.nombre || "Desconocido"
            }
        };
    });

    console.log("Resultado final:", result); // <- Agregar esto
    return result;
};

export const getInventoryById = async (id: string): Promise<Inventory> => {
    const response = await api.get(`/productos/${id}`);
    const prod = response.data;
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.subcategoriaId?.id_subcategoria || "",
        id_empresa: prod.id_empresa?.id_empresa || ""
    };
};

export const createInventory = async (product: Omit<Inventory, "id">): Promise<Inventory> => {
    const response = await api.post("/productos", {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio_unitario: product.precio_unitario,
        subcategoriaId: {
            id_subcategoria: typeof product.subcategoriaId === 'object'
                ? product.subcategoriaId.id_subcategoria
                : product.subcategoriaId
        },
        id_empresa: {
            id_empresa: typeof product.id_empresa === 'object'
                ? product.id_empresa.id_empresa
                : product.id_empresa
        }
    });
    const prod = response.data;
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.subcategoriaId?.id_subcategoria || "",
        id_empresa: prod.id_empresa?.id_empresa || ""
    };
};

export const updateInventory = async (id: string, product: Partial<Inventory>): Promise<Inventory> => {
    const response = await api.patch(`/productos/${id}`, {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio_unitario: product.precio_unitario,
        subcategoriaId: {
            id_subcategoria: typeof product.subcategoriaId === 'object'
                ? product.subcategoriaId?.id_subcategoria
                : product.subcategoriaId
        },
        id_empresa: {
            id_empresa: typeof product.id_empresa === 'object'
                ? product.id_empresa?.id_empresa
                : product.id_empresa
        }
    });
    const prod = response.data;
    return {
        id: prod.id_producto,
        nombre: prod.nombre,
        descripcion: prod.descripcion,
        precio_unitario: prod.precio_unitario,
        subcategoriaId: prod.subcategoriaId?.id_subcategoria || "",
        id_empresa: prod.id_empresa?.id_empresa || ""
    };
};

export const deleteInventory = async (id: string): Promise<void> => {
    await api.delete(`/productos/${id}`);
};