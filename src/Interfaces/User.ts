import { UUID } from "crypto";

export interface User {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    telefono?: string;
    direccion?: string;
    id_empresa?: UUID;
    id_cliente?: UUID;
    rol?: string;
}

