// Servicio para manejar operaciones relacionadas con empresas

export interface Company {
  id_empresa: string;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export async function createCompany(company: Company): Promise<Company> {
  const response = await fetch(`${API_BASE_URL}/empresas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  });
  if (!response.ok) {
    throw new Error('Error al registrar empresa');
  }
  return response.json();
}

export async function getCompanies(): Promise<Company[]> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  const response = await fetch(`${API_BASE_URL}/empresas`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener empresas');
  }
  return response.json();
}
