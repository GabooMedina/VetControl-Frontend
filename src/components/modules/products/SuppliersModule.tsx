import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
  Supplier,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../../../services/products/suplierService";
import {
  Empresa,
  getEmpresas
} from "../../../services/products/companyService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function SuppliersModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, suppData] = await Promise.all([
          getEmpresas(),
          getSuppliers()
        ]);

        console.log("Empresas cargadas:", empData);
        console.log("Proveedores cargados:", suppData);

        setEmpresas(empData);
        setSuppliers(suppData);
      } catch (error: any) {
        if (error.response?.status === 401) {
          showToast.error("Sesión expirada. Inicie sesión nuevamente.");
          navigate("/login");
        } else {
          showToast.error("Error al cargar proveedores o empresas.");
          console.error("Error details:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const supplierFields: Field[] = [
    {
      name: "nombre",
      label: "Nombre del Proveedor",
      type: "text",
      required: true
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      required: true
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "text",
      required: true
    },
    {
      name: "email",
      label: "Email",
      type: "email",
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
    }
  ];

  const handleCreate = () => {
    setCurrentSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    if (!supplier.id) {
      showToast.error("Proveedor inválido para editar");
      return;
    }
    console.log("Editando proveedor:", supplier);
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    try {
      console.log("Datos del formulario:", formData);
      
      if (!formData.nombre || !formData.direccion || !formData.telefono ||
        !formData.email || !formData.id_empresa) {
        throw new Error("Todos los campos son requeridos");
      }

      const payload = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        id_empresa: formData.id_empresa
      };

      console.log("Payload preparado:", payload);

      if (currentSupplier?.id) {
        const updated = await updateSupplier(currentSupplier.id, payload);
        setSuppliers(suppliers.map(supp =>
          supp.id === currentSupplier.id ? updated : supp
        ));
        showToast.success("Proveedor actualizado correctamente");
      } else {
        const created = await createSupplier(payload);
        setSuppliers([...suppliers, created]);
        showToast.success("Proveedor creado correctamente");
      }

      setIsModalOpen(false);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error al guardar proveedor";
      showToast.error(msg);
      console.error("Error details:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      setSuppliers(suppliers.filter(supp => supp.id !== id));
      showToast.success("Proveedor eliminado correctamente");
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Error al eliminar proveedor";
      showToast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Cargando Proveedores...</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Proveedores</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nuevo Proveedor
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: 'nombre', label: 'Nombre' },
          { name: 'direccion', label: 'Dirección' },
          { name: 'telefono', label: 'Teléfono' },
          { name: 'email', label: 'Email' },
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
          }
        ]}
        initialData={suppliers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
        fields={supplierFields}
        initialData={
          currentSupplier
            ? {
              ...currentSupplier,
              id_empresa: typeof currentSupplier.id_empresa === 'object'
                ? currentSupplier.id_empresa.id_empresa
                : currentSupplier.id_empresa
            }
            : {}
        }
        onSubmit={handleSubmit}
        onDelete={currentSupplier ? () => currentSupplier.id && handleDelete(currentSupplier.id) : undefined}
        isEditing={!!currentSupplier}
      />
    </div>
  );
}