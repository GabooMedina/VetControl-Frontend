import api from "../api";

export interface Supplier {
    id?: string;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    id_empresa: string | { id_empresa: string; nombre?: string };
    id_proveedor?: string;
}

export const getSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get("/proveedores");
    console.log("Datos del backend:", response.data);
    return response.data.map((prov: any) => ({
        id: prov.id_proveedor || prov.id,
        nombre: prov.nombre,
        direccion: prov.direccion,
        telefono: prov.telefono,
        email: prov.email,
        id_empresa: prov.id_empresa,
        id_proveedor: prov.id_proveedor
    }));
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
    const response = await api.get(`/proveedores/${id}`);
    const prov = response.data;
    return {
        id: prov.id_proveedor || prov.id,
        nombre: prov.nombre,
        direccion: prov.direccion,
        telefono: prov.telefono,
        email: prov.email,
        id_empresa: prov.id_empresa?.id_empresa || prov.id_empresa || "",
        id_proveedor: prov.id_proveedor
    };
};

export const createSupplier = async (supplier: Omit<Supplier, "id">): Promise<Supplier> => {
    const payload: any = {
        nombre: supplier.nombre,
        direccion: supplier.direccion,
        telefono: supplier.telefono,
        email: supplier.email,
        // Según tu API, necesitas enviar id_empresa como string directo
        id_empresa: typeof supplier.id_empresa === 'object'
            ? supplier.id_empresa.id_empresa
            : supplier.id_empresa
    };

    console.log("Payload CREATE:", payload);
    const response = await api.post("/proveedores", payload);
    const prov = response.data;
    
    return {
        id: prov.id_proveedor || prov.id,
        nombre: prov.nombre,
        direccion: prov.direccion,
        telefono: prov.telefono,
        email: prov.email,
        id_empresa: prov.id_empresa,
        id_proveedor: prov.id_proveedor
    };
};

export const updateSupplier = async (id: string, supplier: Partial<Supplier>): Promise<Supplier> => {
    const payload: any = {
        nombre: supplier.nombre,
        direccion: supplier.direccion,
        telefono: supplier.telefono,
        email: supplier.email,
        // Según tu API, necesitas enviar id_empresa como string directo
        id_empresa: typeof supplier.id_empresa === 'object'
            ? supplier.id_empresa.id_empresa
            : supplier.id_empresa
    };

    console.log("Payload UPDATE:", payload);
    const response = await api.patch(`/proveedores/${id}`, payload);
    const prov = response.data;
    
    return {
        id: prov.id_proveedor || prov.id,
        nombre: prov.nombre,
        direccion: prov.direccion,
        telefono: prov.telefono,
        email: prov.email,
        id_empresa: prov.id_empresa,
        id_proveedor: prov.id_proveedor
    };
};

export const deleteSupplier = async (id: string): Promise<void> => {
    await api.delete(`/proveedores/${id}`);
};