import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

// Estructura del formulario
const fields: Field[] = [
  { name: "name", label: "Nombre del producto", type: "text" },
  { 
    name: "category", 
    label: "Categoría", 
    type: "text", // Se cambia a 'text' ya que la categoría será fija
    defaultValue: "Medicamento" // La categoría será Medicamento por defecto
  },
  { name: "stock", label: "Stock", type: "number" },
  { name: "minStock", label: "Stock mínimo", type: "number" },
  { name: "price", label: "Precio", type: "number" },
  { name: "expiryDate", label: "Fecha de vencimiento", type: "date" },
];


// Datos de ejemplo
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
    name: "Paracetamol 500mg",
    category: "Medicamento",
    stock: 100,
    minStock: 20,
    price: 8.49,
    expiryDate: "2025-01-15",
  },
  {
    id: "3",
    name: "Ibuprofeno 200mg",
    category: "Medicamento",
    stock: 60,
    minStock: 15,
    price: 12.79,
    expiryDate: "2024-09-20",
  },
  {
    id: "4",
    name: "Ciprofloxacino 500mg",
    category: "Medicamento",
    stock: 80,
    minStock: 25,
    price: 20.99,
    expiryDate: "2025-03-10",
  },
  {
    id: "5",
    name: "Doxiciclina 100mg",
    category: "Medicamento",
    stock: 120,
    minStock: 30,
    price: 18.49,
    expiryDate: "2025-07-05",
  }
];


export default function Inventory() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<typeof mockInventory>([]);
  const [currentItem, setCurrentItem] = useState<any>(null);

  useEffect(() => {
    setData(mockInventory);
  }, [location.pathname]);

  const handleAdd = () => {
    setCurrentItem(null);
    setOpen(true);
  };

  const handleSubmit = (item: any) => {
    if (currentItem) {
      const updated = data.map((d) => (d.id === currentItem.id ? { ...currentItem, ...item } : d));
      setData(updated);
    } else {
      const newItem = { ...item, id: (data.length + 1).toString() };
      setData([...data, newItem]);
    }
    setOpen(false);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    const filtered = data.filter((d) => d.id !== id);
    setData(filtered);
    setOpen(false);
  };

  const tableFields = fields.map((field) => ({
    name: field.name,
    label: field.label,
    render: (value: any) => value ?? "-",
  }));

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Medicamentos</h2>
        <PrimaryButton onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo medicamento
        </PrimaryButton>
      </div>

      <DataTable
        fields={tableFields}
        initialData={data}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={open}
        title={currentItem ? "Editar Medicamneto" : "Agregar nuevo Medicamento"}
        fields={fields}
        initialData={currentItem || {}}
        onSubmit={handleSubmit}
        onDelete={currentItem ? () => handleDelete(currentItem.id) : undefined}
        onClose={() => setOpen(false)}
        isEditing={!!currentItem}
      />
    </div>
  );
}
