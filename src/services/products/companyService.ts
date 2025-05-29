import api from "../api";

export interface Empresa {
    id: string;
    nombre: string;
}

export const getEmpresas = async (): Promise<Empresa[]> => {
    const response = await api.get("/empresas");
    return response.data.map((emp: any) => ({
        id: emp.id_empresa,
        nombre: emp.nombre
    }));
};

export const getEmpresaById = async (id: string): Promise<Empresa> => {
    const response = await api.get(`/empresas/${id}`);
    const emp = response.data;
    return {
        id: emp.id_empresa,
        nombre: emp.nombre
    };
};
