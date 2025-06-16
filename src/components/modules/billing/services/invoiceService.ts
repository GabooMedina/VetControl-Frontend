import { Company } from './../../../../auth/services/companyService';
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

interface Invoice {
  fecha_emision: string;
  total: number;
  metodo_pago: string;
  id_cliente: number;
  id_empresa: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createInvoice(invoice: Invoice) {
  // invoice debe tener: fecha_emision, total, metodo_pago, id_cliente, id_empresa
  const response = await axios.post(
    `${API_URL}/facturas`,
    invoice,
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function getInvoices(idCompany: number) {
  // Obtiene todas las facturas de una empresa por su ID
  const response = await axios.get(
    `${API_URL}/facturas/empresa/${idCompany}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
  
}

export async function getInvoicesByID(invoiceId: number) {
  // Obtiene una factura por su ID
  const response = await axios.get(
    `${API_URL}/facturas/${invoiceId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function updateInvoice(
  invoiceId: number,
  invoice: Partial<Invoice>
) {
  const response = await axios.patch(
    `${API_URL}/facturas/${invoiceId}`,
    invoice,
    { headers: getAuthHeaders() }
  );
  return response.data;
}

export async function deleteInvoice(invoiceId: number) {
  // Elimina una factura por su ID
  const response = await axios.delete(
    `${API_URL}/facturas/${invoiceId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
}
