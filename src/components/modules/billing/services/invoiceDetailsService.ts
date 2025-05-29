import axios from "axios"; 

const API_URL = import.meta.env.VITE_BASE_URL;

export interface InvoiceDetail {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_factura: { id_factura: number };
  id_lote?: { id_lote: number };
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createInvoiceDetail = async (detail: InvoiceDetail) => {
  try {
    const response = await axios.post(`${API_URL}/detalle-factura`, detail, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al crear detalle de factura:', error);
    throw error;
  }
}

export const getInvoiceDetailsByInvoiceId = async (invoiceId: number) => {
  try {
    const response = await axios.get(`${API_URL}/detalle-factura/${invoiceId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener detalles de factura:', error);
    throw error;
  }
}

export const updateInvoiceDetail = async (detailId: number, detail: Partial<InvoiceDetail>) => {
  try {
    const response = await axios.patch(`${API_URL}/detalle-factura/${detailId}`, detail, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar detalle de factura:', error);
    throw error;
  }
}

export const deleteInvoiceDetail = async (detailId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/detalle-factura/${detailId}`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar detalle de factura:', error);
    throw error;
  }
}