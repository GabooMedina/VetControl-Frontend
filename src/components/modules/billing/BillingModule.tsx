import { useState, useEffect } from "react";
import { Plus, Printer, CreditCard } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field, TableField } from "../../../Interfaces/TypesData";
import { loadStripe } from "@stripe/stripe-js";
import { createStripePaymentIntent } from "./services/stripeService";
import { StripeEmbeddedForm } from "./StripeEmbeddedForm";
import { createInvoice } from "./services/invoiceService";
import { getClients } from "../../../services/records/clientService";
import { getCompanies } from "../../../auth/services/companyService";
import { createInvoiceDetail, InvoiceDetail } from "./services/invoiceDetailsService";
import { useInvoiceStore } from '../../../store/invoiceStore';
import printJS from "print-js";

const mockInvoices = [
  {
    id: "INV-001",
    client: "Juan Pérez",
    date: "2023-10-10",
    total: 66.98,
    status: "Pagada",
  },
  {
    id: "INV-002",
    client: "María González",
    date: "2023-10-12",
    total: 25.0,
    status: "Pendiente",
  },
  {
    id: "INV-003",
    client: "Carlos Rodríguez",
    date: "2023-10-14",
    total: 38.5,
    status: "Pagada",
  },
  {
    id: "INV-004",
    client: "Ana Martínez",
    date: "2023-10-15",
    total: 35.0,
    status: "Pendiente",
  },
  {
    id: "INV-005",
    client: "Luis Sánchez",
    date: "2023-10-16",
    total: 45.0,
    status: "Pagada",
  },
  {
    id: "INV-006",
    client: "Lucía Fernández",
    date: "2023-10-17",
    total: 52.75,
    status: "Pendiente",
  },
  {
    id: "INV-007",
    client: "Pedro Torres",
    date: "2023-10-18",
    total: 60.0,
    status: "Pagada",
  },
  {
    id: "INV-008",
    client: "Sofía Ruiz",
    date: "2023-10-19",
    total: 29.99,
    status: "Pagada",
  },
  {
    id: "INV-009",
    client: "Diego Castro",
    date: "2023-10-20",
    total: 41.25,
    status: "Pendiente",
  },
  {
    id: "INV-010",
    client: "Valeria Navarro",
    date: "2023-10-21",
    total: 33.5,
    status: "Pagada",
  }  
];

// Mock de detalles para cada factura
const mockInvoiceDetails: Record<string, any[]> = {
  "INV-001": [
    { descripcion: "Consulta general", cantidad: 1, precio_unitario: 30.00, subtotal: 30.00 },
    { descripcion: "Vacuna antirrábica", cantidad: 2, precio_unitario: 18.49, subtotal: 36.98 },
  ],
  "INV-002": [
    { descripcion: "Desparasitación", cantidad: 1, precio_unitario: 25.00, subtotal: 25.00 },
  ],
  "INV-003": [
    { descripcion: "Radiografía", cantidad: 1, precio_unitario: 20.00, subtotal: 20.00 },
    { descripcion: "Medicamento", cantidad: 1, precio_unitario: 18.50, subtotal: 18.50 },
  ],
  "INV-004": [
    { descripcion: "Consulta", cantidad: 1, precio_unitario: 20.00, subtotal: 20.00 },
    { descripcion: "Análisis de sangre", cantidad: 1, precio_unitario: 15.00, subtotal: 15.00 },
  ],
  "INV-005": [
    { descripcion: "Vacuna triple", cantidad: 1, precio_unitario: 45.00, subtotal: 45.00 },
  ],
  "INV-006": [
    { descripcion: "Consulta", cantidad: 1, precio_unitario: 30.00, subtotal: 30.00 },
    { descripcion: "Desparasitación", cantidad: 1, precio_unitario: 22.75, subtotal: 22.75 },
  ],
  "INV-007": [
    { descripcion: "Cirugía menor", cantidad: 1, precio_unitario: 60.00, subtotal: 60.00 },
  ],
  "INV-008": [
    { descripcion: "Consulta", cantidad: 1, precio_unitario: 29.99, subtotal: 29.99 },
  ],
  "INV-009": [
    { descripcion: "Vacuna", cantidad: 1, precio_unitario: 20.00, subtotal: 20.00 },
    { descripcion: "Medicamento", cantidad: 1, precio_unitario: 21.25, subtotal: 21.25 },
  ],
  "INV-010": [
    { descripcion: "Consulta", cantidad: 1, precio_unitario: 15.00, subtotal: 15.00 },
    { descripcion: "Vacuna", cantidad: 1, precio_unitario: 18.50, subtotal: 18.50 },
  ],
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function BillingModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<number|null>(null);
  const [details, setDetails] = useState<InvoiceDetail[]>([]);
  const [detailsTotal, setDetailsTotal] = useState(0);
  const [addingDetail, setAddingDetail] = useState(false);
  const [detailForm, setDetailForm] = useState<{ descripcion: string; cantidad: number; precio_unitario: number; id_lote?: number }>({ descripcion: '', cantidad: 1, precio_unitario: 0, id_lote: undefined });

  const { invoices, setInvoices, fetchInvoices, addInvoice } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handlePay = async (invoice: any) => {
    try {
      // Solicita el PaymentIntent al backend
      const data = await createStripePaymentIntent({ amount: Math.round(invoice.total * 100) });
      if (data.clientSecret) {
        setCurrentInvoice(invoice); // Guardar la factura actual
        setClientSecret(data.clientSecret);
        setShowStripeForm(true);
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (error) {
      alert("Error al conectar con Stripe.");
    }
  };

  const tableFields: TableField[] = [
    { 
      name: "id", 
      label: "N° Factura"
    },
    { 
      name: "client", 
      label: "Cliente"
    },
    { 
      name: "date", 
      label: "Fecha",
      render: (value: string) => formatDate(value)
    },
    { 
      name: "total", 
      label: "Total",
      render: (value: number) => formatCurrency(value)
    },
    { 
      name: "status", 
      label: "Estado",
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === "Pagada" ? "bg-green-100 text-green-800" :
          value === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {value}
        </span>
      )
    },
    {
      name: "pay",
      label: "Pago",
      render: (_: any, row: any) =>
        row.status === "Pendiente" ? (
          <button
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            onClick={() => handlePay(row)}
            title="Pagar con Stripe"
          >
            <CreditCard className="w-4 h-4" /> Pagar
          </button>
        ) : null
    }
  ];

  const invoiceFields: Field[] = [
    {
      name: "date",
      label: "Fecha",
      type: "date",
      required: true
    },
    {
      name: "total",
      label: "Total",
      type: "number",
      required: true,
      placeholder: "0.00"
    },
    {
      name: "metodo_pago",
      label: "Método de Pago",
      type: "select",
      options: [
        { value: "Tarjeta de crédito", label: "Tarjeta de crédito" },
        { value: "Efectivo", label: "Efectivo" },
        { value: "Transferencia", label: "Transferencia" }
      ],
      required: true
    },
    {
      name: "id_cliente",
      label: "Cliente",
      type: "select",
      required: true,
      options: loadingClients ? [{ value: "", label: "Cargando..." }] : clients.map((c: any) => ({ value: c.id, label: `${c.nombre} ${c.apellido}` }))
    },
    {
      name: "id_empresa",
      label: "Empresa",
      type: "select",
      required: true,
      options: loadingCompanies ? [{ value: "", label: "Cargando..." }] : companies.map((e: any) => ({ value: e.id_empresa, label: e.nombre }))
    },
    {
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { value: "Pagada", label: "Pagada" },
        { value: "Pendiente", label: "Pendiente" }
      ],
      required: true
    }
  ];

  const handleCreate = () => {
    setCurrentInvoice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice: any) => {
    setCurrentInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter(invoice => invoice.id_factura !== id));
  };

  const handlePrint = (invoice: any) => {
  const details = mockInvoiceDetails[invoice.id] || [];

  // Construir HTML para impresión
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 24px;">
      <h2>Factura ${invoice.id}</h2>
      <p><strong>Cliente:</strong> ${invoice.client}</p>
      <p><strong>Fecha:</strong> ${formatDate(invoice.date)}</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">Descripción</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Cantidad</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Precio Unitario</th>
            <th style="border: 1px solid #ccc; padding: 8px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${details.map(item => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.descripcion}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.cantidad}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${formatCurrency(item.precio_unitario)}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">${formatCurrency(item.subtotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <h3 style="text-align: right; margin-top: 20px;">Total: ${formatCurrency(invoice.total)}</h3>
    </div>
  `;

  // Usar print-js para imprimir directamente el contenido HTML
  printJS({
    printable: htmlContent,
    type: 'raw-html',
    style: `
      body { font-family: sans-serif; }
      h2, h3 { margin: 0; padding: 0; }
      table { border: 1px solid #ccc; }
    `
  });
};


  // Calcular total de detalles
  useEffect(() => {
    const total = details.reduce((acc, d) => acc + d.subtotal, 0);
    setDetailsTotal(total);
  }, [details]);

  // Nuevo handleSubmit: tras crear factura, mostrar modal de detalles
  const handleSubmit = async (data: any) => {
    const factura = {
      fecha_emision: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      total: 0, // Se actualizará luego
      metodo_pago: data.metodo_pago,
      id_cliente: data.id_cliente,
      id_empresa: data.id_empresa
    };
    try {
      const facturaCreada = await createInvoice(factura);
      setCreatedInvoiceId(facturaCreada.id_factura || facturaCreada.id);
      setShowDetailsModal(true);
      setDetails([]);
      addInvoice(facturaCreada); // Agregar al store
    } catch (e) {
      // Puedes mostrar un toast de error aquí
    }
    setIsModalOpen(false);
  };

  // Función para agregar un detalle
  const handleAddDetail = async () => {
    if (!createdInvoiceId) return;
    setAddingDetail(true);
    const subtotal = detailForm.cantidad * detailForm.precio_unitario;
    const detail: InvoiceDetail = {
      descripcion: detailForm.descripcion,
      cantidad: detailForm.cantidad,
      precio_unitario: detailForm.precio_unitario,
      subtotal,
      id_factura: { id_factura: createdInvoiceId },
      ...(detailForm.id_lote ? { id_lote: { id_lote: detailForm.id_lote } } : {})
    };
    try {
      await createInvoiceDetail(detail);
      setDetails(prev => [...prev, detail]);
      setDetailForm({ descripcion: '', cantidad: 1, precio_unitario: 0, id_lote: undefined });
    } catch (e) {
      // Toast error
    }
    setAddingDetail(false);
  };

  // Función para finalizar y actualizar el total de la factura
  const handleFinishDetails = async () => {
    if (!createdInvoiceId) return;
    // Actualizar total en la factura
    try {
      await import('./services/invoiceService').then(mod => mod.updateInvoice(createdInvoiceId, { total: detailsTotal }));
    } catch (e) {
      // Toast error
    }
    setShowDetailsModal(false);
    setCreatedInvoiceId(null);
    setDetails([]);
  };

  // Nuevo: Marcar la factura como pagada al éxito del pago embebido
  const handleStripeSuccess = () => {
    if (currentInvoice) {
      const updated = invoices.map(inv =>
        inv.id_factura === currentInvoice.id_factura ? { ...inv, status: "Pagada" } : inv
      );
      setInvoices(updated);
    }
    setShowStripeForm(false);
    setClientSecret(null);
    setCurrentInvoice(null);
  };

  // Redirigir si la URL contiene parámetros de Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("payment_intent") || params.has("redirect_status")) {
      window.history.replaceState({}, document.title, "/dashboard/facturacion/facturas");
    }
  }, []);

  // Cargar clientes y empresas al abrir el modal
  useEffect(() => {
    if (isModalOpen) {
      setLoadingClients(true);
      setLoadingCompanies(true);
      getClients()
        .then((data: any[]) => setClients(data))
        .catch(() => setClients([]))
        .finally(() => setLoadingClients(false));
      getCompanies()
        .then((data: any[]) => setCompanies(data))
        .catch(() => setCompanies([]))
        .finally(() => setLoadingCompanies(false));
    }
  }, [isModalOpen]);

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Facturación</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nueva Factura
        </PrimaryButton>
      </div>

      <DataTable
        fields={tableFields}
        initialData={mockInvoices} // Usar mockInvoices en vez de invoices
        actions={[
          {
            icon: <Printer className="h-4 w-4" />,
            onClick: handlePrint,
            tooltip: "Imprimir factura"
          }
        ]}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentInvoice ? "Editar Factura" : "Nueva Factura"}
        fields={invoiceFields}
        initialData={currentInvoice ?? {}}
        onSubmit={handleSubmit}
        onDelete={currentInvoice ? () => handleDelete(currentInvoice.id) : undefined}
        isEditing={!!currentInvoice}
      />

      {showStripeForm && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowStripeForm(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-gray-900">Pagar Factura</h2>
            <StripeEmbeddedForm clientSecret={clientSecret} onSuccess={handleStripeSuccess} paymentMethodType="card" />
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowDetailsModal(false)}
              aria-label="Cerrar"
            >×</button>
            <h2 className="text-xl font-bold mb-4 text-gray-900">Agregar Detalles a la Factura</h2>
            <div className="mb-4">
              <input
                className="border rounded px-2 py-1 mr-2"
                placeholder="Descripción"
                value={detailForm.descripcion}
                onChange={e => setDetailForm(f => ({ ...f, descripcion: e.target.value }))}
              />
              <input
                type="number"
                className="border rounded px-2 py-1 mr-2 w-20"
                placeholder="Cantidad"
                min={1}
                value={detailForm.cantidad}
                onChange={e => setDetailForm(f => ({ ...f, cantidad: Number(e.target.value) }))}
              />
              <input
                type="number"
                className="border rounded px-2 py-1 mr-2 w-24"
                placeholder="Precio unitario"
                min={0}
                value={detailForm.precio_unitario}
                onChange={e => setDetailForm(f => ({ ...f, precio_unitario: Number(e.target.value) }))}
              />
              <input
                type="number"
                className="border rounded px-2 py-1 mr-2 w-24"
                placeholder="ID Lote (opcional)"
                value={detailForm.id_lote || ''}
                onChange={e => setDetailForm(f => ({ ...f, id_lote: e.target.value ? Number(e.target.value) : undefined }))}
              />
              <button
                className="bg-teal-600 text-white px-3 py-1 rounded disabled:opacity-50"
                onClick={handleAddDetail}
                disabled={addingDetail || !detailForm.descripcion || !detailForm.cantidad || !detailForm.precio_unitario}
              >Agregar</button>
            </div>
            <div className="mb-4">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-1">Descripción</th>
                    <th className="p-1">Cantidad</th>
                    <th className="p-1">Precio Unitario</th>
                    <th className="p-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((d, i) => (
                    <tr key={i}>
                      <td className="p-1">{d.descripcion}</td>
                      <td className="p-1">{d.cantidad}</td>
                      <td className="p-1">{d.precio_unitario}</td>
                      <td className="p-1">{d.subtotal}</td>
                    </tr>
                  ))}
                  {details.length === 0 && (
                    <tr><td colSpan={4} className="text-center text-gray-400">Sin detalles aún</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">{detailsTotal.toFixed(2)}</span>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
              onClick={handleFinishDetails}
              disabled={details.length === 0}
            >Finalizar Factura</button>
          </div>
        </div>
      )}
    </div>
  );
}