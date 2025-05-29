import { create } from 'zustand';
import { getInvoicesByID, createInvoice, updateInvoice, deleteInvoice } from '../components/modules/billing/services/invoiceService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export interface Invoice {
  id_factura: number;
  fecha_emision: string;
  total: number;
  metodo_pago: string;
  id_cliente: string;
  id_empresa: string;
  status?: string;
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
      const response = await axios.get(`${API_URL}/facturas`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      set({ invoices: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message ?? 'Error al cargar facturas', loading: false });
    }
  },
  addInvoice: (invoice) => set((state) => ({ invoices: [...state.invoices, invoice] })),
  setInvoices: (invoices) => set({ invoices }),
}));
