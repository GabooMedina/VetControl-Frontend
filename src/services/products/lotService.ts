import api from "../api";

export interface Lot {
    id?: string;
    codigo_lote: string;
    fecha_entrada: string;
    fecha_venc: string;
    stock_actual: number;
    estado: string;
    id_producto: string | { id: string; nombre?: string };
    id_proveedor: string | { id: string; nombre?: string };
    id_empresa: string | { id: string; nombre?: string };
    id_lote?: string;
}

export const getLots = async (): Promise<Lot[]> => {
    const response = await api.get("/lotes");
    console.log("Datos del backend:", response.data);
    return response.data.map((lote: any) => ({
        id: lote.id_lote || lote.id,
        codigo_lote: lote.codigo_lote,
        fecha_entrada: lote.fecha_entrada,
        fecha_venc: lote.fecha_venc,
        stock_actual: lote.stock_actual,
        estado: lote.estado,
        id_producto: lote.id_producto,
        id_proveedor: lote.id_proveedor,
        id_empresa: lote.id_empresa,
        id_lote: lote.id_lote
    }));
};

export const getLotById = async (id: string): Promise<Lot> => {
    const response = await api.get(`/lotes/${id}`);
    const lote = response.data;
    return {
        id: lote.id_lote || lote.id,
        codigo_lote: lote.codigo_lote,
        fecha_entrada: lote.fecha_entrada,
        fecha_venc: lote.fecha_venc,
        stock_actual: lote.stock_actual,
        estado: lote.estado,
        id_producto: lote.id_producto?.id || lote.id_producto || "",
        id_proveedor: lote.id_proveedor?.id || lote.id_proveedor || "",
        id_empresa: lote.id_empresa?.id || lote.id_empresa || "",
        id_lote: lote.id_lote
    };
};

export const createLot = async (lot: Omit<Lot, "id">): Promise<Lot> => {
    // Formatear las fechas al formato ISO que espera la API
    const formatDateForAPI = (dateString: string): string => {
        if (!dateString) return dateString;
        
        // Si ya está en formato ISO, devolverlo tal como está
        if (dateString.includes('T')) return dateString;
        
        // Si es una fecha en formato YYYY-MM-DD, convertir a ISO
        const date = new Date(dateString + 'T00:00:00.000Z');
        return date.toISOString();
    };

    const payload: any = {
        codigo_lote: lot.codigo_lote,
        fecha_entrada: formatDateForAPI(lot.fecha_entrada),
        fecha_venc: formatDateForAPI(lot.fecha_venc),
        stock_actual: Number(lot.stock_actual),
        estado: lot.estado,
        id_producto: {
            id: typeof lot.id_producto === 'object'
                ? lot.id_producto.id
                : lot.id_producto
        },
        id_proveedor: {
            id: typeof lot.id_proveedor === 'object'
                ? lot.id_proveedor.id
                : lot.id_proveedor
        },
        id_empresa: {
            id: typeof lot.id_empresa === 'object'
                ? lot.id_empresa.id
                : lot.id_empresa
        }
    };

    console.log("=== DEBUG CREAR LOTE ===");
    console.log("Datos recibidos:", lot);
    console.log("Payload a enviar:", JSON.stringify(payload, null, 2));
    console.log("URL completa:", api.defaults.baseURL + "/lotes");
    
    try {
        // Primero verificamos que los IDs existan
        console.log("Verificando IDs:");
        console.log("- Producto ID:", payload.id_producto.id);
        console.log("- Proveedor ID:", payload.id_proveedor.id); 
        console.log("- Empresa ID:", payload.id_empresa.id);
        
        const response = await api.post("/lotes", payload);
        console.log("Respuesta exitosa:", response.data);
        
        const lote = response.data;
        
        return {
            id: lote.id_lote || lote.id,
            codigo_lote: lote.codigo_lote,
            fecha_entrada: lote.fecha_entrada,
            fecha_venc: lote.fecha_venc,
            stock_actual: lote.stock_actual,
            estado: lote.estado,
            id_producto: lote.id_producto,
            id_proveedor: lote.id_proveedor,
            id_empresa: lote.id_empresa,
            id_lote: lote.id_lote
        };
    } catch (error: any) {
        console.error("=== ERROR DETALLADO ===");
        console.error("Status:", error.response?.status);
        console.error("Status Text:", error.response?.statusText);
        console.error("Headers:", error.response?.headers);
        console.error("Data:", error.response?.data);
        console.error("Config:", error.config);
        console.error("Error completo:", error);
        
        // Intentar diferentes formatos si el primero falla
        if (error.response?.status === 500) {
            console.log("Intentando formato alternativo...");
            
            // Formato alternativo 1: enviar solo los IDs como strings
            const alternativePayload1 = {
                ...payload,
                id_producto: payload.id_producto.id,
                id_proveedor: payload.id_proveedor.id,
                id_empresa: payload.id_empresa.id
            };
            
            console.log("Probando formato alternativo 1:", JSON.stringify(alternativePayload1, null, 2));
            
            try {
                const response = await api.post("/lotes", alternativePayload1);
                console.log("¡Formato alternativo 1 funcionó!");
                
                const lote = response.data;
                return {
                    id: lote.id_lote || lote.id,
                    codigo_lote: lote.codigo_lote,
                    fecha_entrada: lote.fecha_entrada,
                    fecha_venc: lote.fecha_venc,
                    stock_actual: lote.stock_actual,
                    estado: lote.estado,
                    id_producto: lote.id_producto,
                    id_proveedor: lote.id_proveedor,
                    id_empresa: lote.id_empresa,
                    id_lote: lote.id_lote
                };
            } catch (error2: any) {
                console.error("Formato alternativo 1 también falló:", error2.response?.data);
            }
        }
        
        throw error;
    }
};

export const updateLot = async (id: string, lot: Partial<Lot>): Promise<Lot> => {
    // Formatear las fechas al formato ISO que espera la API
    const formatDateForAPI = (dateString?: string): string | undefined => {
        if (!dateString) return undefined;
        
        // Si ya está en formato ISO, devolverlo tal como está
        if (dateString.includes('T')) return dateString;
        
        // Si es una fecha en formato YYYY-MM-DD, convertir a ISO
        const date = new Date(dateString + 'T00:00:00.000Z');
        return date.toISOString();
    };

    const payload: any = {};
    
    // Solo incluir campos que tienen valores
    if (lot.codigo_lote !== undefined) payload.codigo_lote = lot.codigo_lote;
    if (lot.fecha_entrada !== undefined) payload.fecha_entrada = formatDateForAPI(lot.fecha_entrada);
    if (lot.fecha_venc !== undefined) payload.fecha_venc = formatDateForAPI(lot.fecha_venc);
    if (lot.stock_actual !== undefined) payload.stock_actual = Number(lot.stock_actual);
    if (lot.estado !== undefined) payload.estado = lot.estado;
    
    // Manejar las relaciones como objetos
    if (lot.id_producto !== undefined) {
        payload.id_producto = {
            id: typeof lot.id_producto === 'object'
                ? lot.id_producto.id
                : lot.id_producto
        };
    }
    
    if (lot.id_proveedor !== undefined) {
        payload.id_proveedor = {
            id: typeof lot.id_proveedor === 'object'
                ? lot.id_proveedor.id
                : lot.id_proveedor
        };
    }
    
    if (lot.id_empresa !== undefined) {
        payload.id_empresa = {
            id: typeof lot.id_empresa === 'object'
                ? lot.id_empresa.id
                : lot.id_empresa
        };
    }

    console.log("Payload UPDATE (antes de enviar):", payload);
    
    try {
        const response = await api.patch(`/lotes/${id}`, payload);
        const lote = response.data;
        
        return {
            id: lote.id_lote || lote.id,
            codigo_lote: lote.codigo_lote,
            fecha_entrada: lote.fecha_entrada,
            fecha_venc: lote.fecha_venc,
            stock_actual: lote.stock_actual,
            estado: lote.estado,
            id_producto: lote.id_producto,
            id_proveedor: lote.id_proveedor,
            id_empresa: lote.id_empresa,
            id_lote: lote.id_lote
        };
    } catch (error: any) {
        console.error("Error en updateLot:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteLot = async (id: string): Promise<void> => {
    try {
        await api.delete(`/lotes/${id}`);
    } catch (error: any) {
        console.error("Error en deleteLot:", error.response?.data || error.message);
        throw error;
    }
};