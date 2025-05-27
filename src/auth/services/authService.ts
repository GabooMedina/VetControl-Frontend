import axios from "axios";
import { User } from "../../Interfaces/User";

const API_URL: string = import.meta.env.VITE_BASE_URL;

// Funcion para iniciar sesion, se enviaran los siguientes datos
// email y contraseña, y se recibira un token de autenticacion
export async function login(email: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
}

//Funcion para registrar un usuario en la que se enviaran los siguientes datos
// nombre, apellido, email, contraseña, id_empresa
export async function register(user: User) {
  const response = await axios.post(`${API_URL}/auth/register`, user);
  return response.data;
}

// Funcion para obtener el usuario autenticado
export async function getAuthenticatedUser() {
  const response = await axios.get(`${API_URL}/auth/user`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.data;
}


