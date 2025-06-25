import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;
const idEmpresa = localStorage.getItem("empresa");

export interface Cliente {
  id_cliente: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface Detalle {
  id_detalle: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export interface Invoice {
  id_factura: number;
  fecha_emision: string;
  total: string;
  metodo_pago: string;
  estado: string;
  cliente: Cliente;
  detalles: Detalle[];
}

interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  addInvoice: (invoice: Invoice) => void;
  setInvoices: (invoices: Invoice[]) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  loading: false,
  error: null,
  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/facturas/empresa/${idEmpresa}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (Array.isArray(response.data)) {
        set({ invoices: response.data, loading: false });
      } else {
        console.error("Unexpected response format:", response.data);
        set({ error: "Formato de respuesta inesperado", loading: false });
      }
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
      set({ error: error.message ?? 'Error al cargar facturas', loading: false });
    }
  },
  addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
  setInvoices: (invoices) => {
    set(() => {
      return { invoices };
    });
  },
}));
