import { useState } from "react";
import { Plus, Printer } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field, TableField } from "../../../Interfaces/TypesData";

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

export function BillingModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<any>(null);
  const [invoices, setInvoices] = useState(mockInvoices);

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
    }
  ];

  const invoiceFields: Field[] = [
    {
      name: "client",
      label: "Cliente",
      type: "text",
      required: true,
      placeholder: "Nombre del cliente"
    },
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

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const handlePrint = (invoice: any) => {
    console.log("Imprimir factura:", invoice.id);
    // Lógica para imprimir
  };

  const handleSubmit = (data: any) => {
    if (currentInvoice) {
      setInvoices(invoices.map(invoice =>
        invoice.id === currentInvoice.id ? { ...invoice, ...data } : invoice
      ));
    } else {
      const newInvoice = { 
        id: `INV-${String(invoices.length + 1).padStart(3, "0")}`, 
        ...data 
      };
      setInvoices([...invoices, newInvoice]);
    }
    setIsModalOpen(false);
  };

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
        initialData={currentInvoice || {}}
        onSubmit={handleSubmit}
        onDelete={currentInvoice ? () => handleDelete(currentInvoice.id) : undefined}
        isEditing={!!currentInvoice}
      />
    </div>
  );
}