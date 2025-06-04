import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
  Inventory,
  getInventories,
  createInventory,
  updateInventory,
  deleteInventory
} from "../../../services/products/inventoryService";
import {
  Empresa,
  getEmpresas
} from "../../../services/products/companyService";
import {
  Subcategory,
  getSubcategories,
} from "../../../services/products/subcategoriesService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function InventoryModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInventory, setCurrentInventory] = useState<Inventory | null>(null);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, subcatData, invData] = await Promise.all([
          getEmpresas(),
          getSubcategories(),
          getInventories()
        ]);

        console.log("Empresas cargadas:", empData);
        console.log("Subcategorías cargadas:", subcatData);
        console.log("Inventarios cargados:", invData);

        setEmpresas(empData);
        setSubcategorias(subcatData);
        setInventories(invData);
      } catch (error: any) {
        if (error.response?.status === 401) {
          showToast.error("Sesión expirada. Inicie sesión nuevamente.");
          navigate("/login");
        } else {
          showToast.error("Error al cargar productos, empresas o subcategorías.");
          console.error("Error details:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Crear opciones para subcategorías con opción vacía
  const subcategoryOptions = [
    { label: "-- Sin subcategoría --", value: "" },
    ...subcategorias.map(sub => ({
      label: sub.nombre,
      value: sub.id || ""
    }))
  ];

  const inventoryFields: Field[] = [
    {
      name: "nombre",
      label: "Nombre del Producto",
      type: "text",
      required: true
    },
    {
      name: "descripcion",
      label: "Descripción",
      type: "text",
      required: true
    },
    {
      name: "precio_unitario",
      label: "Precio Unitario",
      type: "number",
      required: true
    },
    {
      name: "id_empresa",
      label: "Empresa",
      type: "select",
      required: true,
      options: empresas.map(emp => ({
        label: emp.nombre,
        value: emp.id || ""
      }))
    },
    {
      name: "subcategoriaId",
      label: "Subcategoría",
      type: "select",
      required: false,
      options: subcategoryOptions
    }
  ];

  const handleCreate = () => {
    setCurrentInventory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (inv: Inventory) => {
    if (!inv.id) {
      showToast.error("Producto inválido para editar");
      return;
    }
    console.log("Editando producto:", inv);
    setCurrentInventory(inv);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      console.log("Datos del formulario:", formData);
      
      if (!formData.nombre || !formData.descripcion || !formData.precio_unitario ||
        !formData.id_empresa) {
        throw new Error("Los campos nombre, descripción, precio y empresa son requeridos");
      }

      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio_unitario: parseFloat(formData.precio_unitario),
        subcategoriaId: formData.subcategoriaId || null, // null si está vacío
        id_empresa: formData.id_empresa
      };

      console.log("Payload preparado:", payload);

      if (currentInventory?.id) {
        const updated = await updateInventory(currentInventory.id, payload);
        setInventories(inventories.map(inv =>
          inv.id === currentInventory.id ? updated : inv
        ));
        showToast.success("Producto actualizado correctamente");
      } else {
        const created = await createInventory(payload);
        setInventories([...inventories, created]);
        showToast.success("Producto creado correctamente");
      }

      setIsModalOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error al guardar producto";
      showToast.error(msg);
      console.error("Error details:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id);
      setInventories(inventories.filter(inv => inv.id !== id));
      showToast.success("Producto eliminado correctamente");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error al eliminar producto";
      showToast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Cargando Productos...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Productos</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nuevo Producto
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: 'nombre', label: 'Nombre' },
          { name: 'descripcion', label: 'Descripción' },
          {
            name: 'precio_unitario',
            label: 'Precio',
            render: (value: any) => {
              const numericValue = typeof value === 'string' ? parseFloat(value) : value;
              return !isNaN(numericValue) ? `$${numericValue.toFixed(2)}` : 'N/A';
            }
          },
          {
            name: 'id_empresa',
            label: 'Empresa',
            render: (value: string | { id_empresa: string; nombre?: string }) => {
              if (!value) return 'N/A';
              
              if (typeof value === 'object') {
                return value.nombre || 'Empresa no encontrada';
              }
              
              const empresa = empresas.find(emp => emp.id === value);
              return empresa?.nombre || 'Empresa no encontrada';
            }
          },
          {
            name: 'subcategoriaId',
            label: 'Subcategoría',
            render: (value: any) => {
              // Si el valor es null, undefined o string vacío
              if (value === null || value === undefined || value === "") {
                return 'Sin subcategoría';
              }

              // Si el valor es un objeto con id_subcategoria
              if (typeof value === 'object' && value.id_subcategoria) {
                if (value.nombre) return value.nombre;
                
                const subcat = subcategorias.find(sub => sub.id === value.id_subcategoria);
                return subcat?.nombre || 'Subcategoría no encontrada';
              }

              // Si es un string (ID), buscamos en las subcategorías cargadas
              if (typeof value === 'string') {
                const subcat = subcategorias.find(sub => sub.id === value);
                return subcat?.nombre || 'Subcategoría no encontrada';
              }

              return 'Sin subcategoría';
            }
          }
        ]}
        initialData={inventories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentInventory ? "Editar Producto" : "Nuevo Producto"}
        fields={inventoryFields}
        initialData={
          currentInventory
            ? {
              ...currentInventory,
              id_empresa: typeof currentInventory.id_empresa === 'object'
                ? currentInventory.id_empresa.id_empresa
                : currentInventory.id_empresa,
              subcategoriaId: currentInventory.subcategoriaId === null 
                ? "" 
                : (typeof currentInventory.subcategoriaId === 'object'
                  ? currentInventory.subcategoriaId.id_subcategoria
                  : currentInventory.subcategoriaId)
            }
            : {}
        }
        onSubmit={handleSubmit}
        onDelete={currentInventory ? () => currentInventory.id && handleDelete(currentInventory.id) : undefined}
        isEditing={!!currentInventory}
      />
    </div>
  );
}