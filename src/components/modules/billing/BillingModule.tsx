import { useState, useEffect } from "react";
import { Plus, Printer, CreditCard } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field, TableField } from "../../../Interfaces/TypesData";
import { createStripePaymentIntent } from "./services/stripeService";
import { StripeEmbeddedForm } from "./StripeEmbeddedForm";
import { createInvoice, getInvoicesByID, getInvoices, updateInvoice } from "./services/invoiceService";
import { getClients } from "../../../services/records/clientService";
import { useInvoiceStore } from '../../../store/invoiceStore';
import printJS from "print-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { showToast } from "../../shared/Toast";
import { createInvoiceDetail as createInvoiceDetailService } from './services/invoiceDetailsService';
// Definición de la constante API_URL
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function BillingModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<number | null>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [detailsTotal, setDetailsTotal] = useState(0);
  const [addingDetail, setAddingDetail] = useState(false);
  const [detailForm, setDetailForm] = useState<{ descripcion: string; cantidad: number; precio_unitario: number; id_lote?: number }>({ descripcion: '', cantidad: 1, precio_unitario: 0, id_lote: undefined });
  const [loadingClients, setLoadingClients] = useState(false);

  const { invoices, setInvoices, fetchInvoices, addInvoice } = useInvoiceStore();

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    console.log("Facturas actualizadas:", invoices);
  }, [invoices]);

  // Efecto para cargar las facturas de la empresa
  const idEmpresa = localStorage.getItem("empresa");

  useEffect(() => {
    if (idEmpresa) {
      getInvoices(idEmpresa)
        .then((data: any[]) => {
          setInvoices(data);
        })
        .catch((error: any) => {
          console.error("Error al obtener las facturas de la empresa:", error);
        });
    }
  }, [idEmpresa]);

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
      name: "id_factura",
      label: "N° Factura"
    },
    {
      name: "cliente",
      label: "Cliente",
      render: (cliente: any) => cliente ? `${cliente.nombre} ${cliente.apellido}` : "—"
    },
    {
      name: "fecha_emision",
      label: "Fecha",
      render: (value: string) => formatDate(value)
    },
    {
      name: "total",
      label: "Total",
      render: (value: number) => formatCurrency(value)
    },
    {
      name: "metodo_pago",
      label: "Método de Pago"
    },
    {
      name: "estado",
      label: "Estado",
      render: (value: string) => value === "pagado" ? "Pagada" : value === "pendiente" ? "Pendiente" : "Anulada"
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
      name: "status",
      label: "Estado",
      type: "select",
      options: [
        { value: "pagado", label: "Pagada" },
        { value: "pendiente", label: "Pendiente" },
        { value: "anulado", label: "Anulada" }
      ],
      required: true
    }
  ];

  const handleCreate = () => {
    setCurrentInvoice(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter(invoice => invoice.id_factura !== id));
  };

  const handlePrint = (invoice: any) => {
    const details = invoice.detalles || [];

    const htmlContent = `
  <div style="font-family: sans-serif; padding: 24px;">
    <h2>Factura ${invoice.id_factura}</h2>
    <p><strong>Cliente:</strong> ${invoice.cliente.nombre} ${invoice.cliente.apellido}</p>
    <p><strong>Teléfono:</strong> ${invoice.cliente.telefono}</p>
    <p><strong>Dirección:</strong> ${invoice.cliente.direccion}</p>
    <p><strong>Fecha de Emisión:</strong> ${formatDate(invoice.fecha_emision)}</p>
    <p><strong>Método de Pago:</strong> ${invoice.metodo_pago}</p>
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
        ${invoice.detalles.map((item: any) => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.descripcion}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${item.cantidad}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${formatCurrency(parseFloat(item.precio_unitario))}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${formatCurrency(parseFloat(item.subtotal))}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <h3 style="text-align: right; margin-top: 20px;">Total: ${formatCurrency(parseFloat(invoice.total))}</h3>
  </div>
`;


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
    const idEmpresa = localStorage.getItem("empresa") || ""; // Asegurar que sea string
    const factura = {
      fecha_emision: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      total: 0, // Se actualizará luego
      metodo_pago: data.metodo_pago,
      id_cliente: data.id_cliente,
      id_empresa: idEmpresa
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
    const detail: any = {
      descripcion: detailForm.descripcion,
      cantidad: detailForm.cantidad,
      precio_unitario: detailForm.precio_unitario,
      subtotal,
      id_factura: createdInvoiceId,
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
      await updateInvoice(createdInvoiceId, { total: detailsTotal });
    } catch (e) {
      // Toast error
    }
    //ver factura actualizada
    const updatedInvoice = await getInvoicesByID(createdInvoiceId.toString());
    console.log("Factura actualizada:", updatedInvoice);
    setShowDetailsModal(false);
    setCreatedInvoiceId(null);
    // recargar facturas y actualizar el store
    await fetchInvoices();
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
      getClients()
        .then((data: any[]) => setClients(data))
        .catch(() => setClients([]))
        .finally(() => setLoadingClients(false));
    }
  }, [isModalOpen]);

  // Se asegura que los datos de la API se utilicen directamente
  useEffect(() => {
    setLoadingClients(true);
    getClients()
      .then((data) => {
        setClients(data);
        console.log("Clientes cargados:", data);
      })
      .catch((error) => {
        console.error("Error al obtener los clientes:", error);
      })
      .finally(() => {
        setLoadingClients(false);
      });
  }, []);

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
        initialData={invoices}
        actions={[
          // mostrar boton de tarjeta de credito si la factura no esta pagada
          
          {
            icon: <CreditCard className="h-4 w-4" />,
            onClick: (row: any) => handlePay(row),
            tooltip: "Pagar factura",
          },
          {
            icon: <Printer className="h-4 w-4" />,
            onClick: (row: any) => handlePrint(row),
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
                className="border rounded px-2 py-1 mr-2 w-full"
                placeholder="Descripción"
                value={detailForm.descripcion}
                onChange={e => setDetailForm(f => ({ ...f, descripcion: e.target.value }))}
              />
              <div className="flex gap-2 mt-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-1/3"
                  placeholder="Cantidad"
                  min={1}
                  value={detailForm.cantidad}
                  onChange={e => setDetailForm(f => ({ ...f, cantidad: Number(e.target.value) }))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1 w-1/3"
                  placeholder="Precio unitario"
                  min={0}
                  value={detailForm.precio_unitario}
                  onChange={e => setDetailForm(f => ({ ...f, precio_unitario: Number(e.target.value) }))}
                />
                <button
                  className="bg-teal-600 text-white px-3 py-1 rounded disabled:opacity-50 w-1/3"
                  onClick={handleAddDetail}
                  disabled={addingDetail || !detailForm.descripcion || !detailForm.cantidad || !detailForm.precio_unitario}
                >Agregar</button>
              </div>
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

// Función para crear detalles de factura
export async function createInvoiceDetail(data: any) {
  const payload = {
    descripcion: data.descripcion,
    cantidad: data.cantidad,
    precio_unitario: data.precio_unitario,
    subtotal: data.subtotal,
    id_factura: data.id_factura,
    id_lote: data.id_lote ? { id_lote: data.id_lote } : undefined // Lote es opcional
  };

  try {
    await createInvoiceDetailService(payload); // Llamada al servicio correcto
  } catch (error) {
    console.error("Error al crear detalles de factura:", error);
    throw error;
  }
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      showToast.error("Stripe no está cargado correctamente.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      showToast.error("CardElement no está disponible.");
      return;
    }

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      showToast.error("Error al crear el método de pago: " + error.message);
    } else {
      showToast.success("Método de pago creado exitosamente.");
      // Aquí puedes enviar el `paymentMethod` al backend para procesar el pago
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <button type="submit" disabled={!stripe}>
        Pagar
      </button>
    </form>
  );
}

export default function BillingModuleWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}