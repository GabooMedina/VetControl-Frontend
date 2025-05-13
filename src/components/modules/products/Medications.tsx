import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

const fields: Field[] = [
  { name: "name", label: "Nombre del producto", type: "text" },
  {
    name: "category",
    label: "Categoría",
    type: "select",
    options: [
      { value: "Medicamento", label: "Medicamento" },
      { value: "Vacuna", label: "Vacuna" },
      { value: "Material", label: "Material" },
      { value: "Accesorio", label: "Accesorio" },
    ],
  },
  { name: "stock", label: "Stock", type: "number" },
  { name: "minStock", label: "Stock mínimo", type: "number" },
  { name: "price", label: "Precio", type: "number" },
  { name: "expiryDate", label: "Fecha de vencimiento", type: "date" },
];

const mockInventory = [
  {
    id: "1",
    name: "Amoxicilina 500mg",
    category: "Medicamento",
    stock: 45,
    minStock: 10,
    price: 15.99,
    expiryDate: "2024-06-30",
  },
  {
    id: "2",
    name: "Vacuna Antirrábica",
    category: "Vacuna",
    stock: 20,
    minStock: 5,
    price: 25.5,
    expiryDate: "2023-12-15",
  },
  {
    id: "3",
    name: "Jeringa 5ml",
    category: "Material",
    stock: 100,
    minStock: 30,
    price: 0.75,
    expiryDate: null,
  },
  {
    id: "4",
    name: "Collar Isabelino",
    category: "Accesorio",
    stock: 15,
    minStock: 5,
    price: 12.99,
    expiryDate: null,
  },
];

export default function MedicationsModule() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<typeof mockInventory>([]);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  useEffect(() => {
    setData(mockInventory);
  }, [location.pathname]);

  const handleAdd = (item: any) => {
    const newItem = { ...item, id: (data.length + 1).toString() };
    setData([...data, newItem]);
    setOpen(false);
    setSelectedRow(null);
  };

  const tableFields = fields.map((field) => ({
    name: field.name,
    label: field.label,
    render: (value: any) => value,
  }));

  // Agregar columna con botón "+"
  tableFields.push({
    name: "action",
    label: "",
    render: () => (
      <button
        onClick={() => setOpen(true)}
        className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full"
        title="Agregar"
      >
        <Plus className="w-4 h-4" />
      </button>
    ),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Medicamentos</h2>

      <DataTable
        fields={tableFields}
        initialData={data}
        onEdit={undefined}
        onDelete={undefined}
        className="mt-1"
      />

      <CrudModal
        isOpen={open}
        title="Agregar nuevo producto"
        fields={fields}
        onSubmit={handleAdd}
        onClose={() => {
          setOpen(false);
          setSelectedRow(null);
        }}
      />
    </div>
  );
}
