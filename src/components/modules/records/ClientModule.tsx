import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import { Client, getClients, createClient, updateClient, deleteClient } from "../../../services/records/clientService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function ClientModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
          navigate("/login");
        } else {
          showToast.error("Error al cargar los clientes");
          console.error("Failed to fetch clients:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [navigate]);

  const clientFields: Field[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true
    },
    {
      name: "apellido",
      label: "Apellido",
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
      name: "telefono",
      label: "Teléfono",
      type: "tel",
      required: true
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      required: true
    },
  ];

  const handleCreate = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: any) => {
    try {
      
      const apiData = {
        ...formData,
        id_empresa: formData.id_empresa || {}
      };

      if (currentClient && currentClient.id) {
        // Verifica que el ID sea válido
        if (!currentClient.id) {
          throw new Error("ID de cliente inválido");
        }
        
        const updatedClient = await updateClient(currentClient.id, apiData);
        setClients(clients.map(client => 
          client.id === currentClient.id ? updatedClient : client
        ));
        showToast.success("Cliente Actualizado Correctamente");
      } else {
        const newClient = await createClient(apiData);
        setClients([...clients, newClient]);
        showToast.success("Cliente Creado Correctamente");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error completo:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else {
        showToast.error(error.response?.data?.message || "Error al guardar el cliente");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      showToast.error("ID de cliente inválido");
      return;
    }

    try {
      await deleteClient(id);
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      showToast.success("Cliente Eliminado Correctamente");
    } catch (error: any) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else if (error.response?.status === 500) {
        showToast.error("Error en el servidor al eliminar el cliente");
      } else {
        showToast.error(error.response?.data?.message || "Error al eliminar el cliente");
      }
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-gray-600 text-lg font-medium animate-pulse">
        Cargando Clientes...
      </div>
    </div>
  );
}

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Clientes</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nuevo Cliente
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: 'nombre', label: 'Nombre' },
          { name: 'apellido', label: 'Apellido' },
          { name: 'email', label: 'Email' },
          { name: 'telefono', label: 'Teléfono' },
          { name: 'direccion', label: 'Dirección' }
        ]}
        initialData={clients}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentClient ? "Editar Cliente" : "Nuevo Cliente"}
        fields={clientFields}
        initialData={currentClient || {}}
        onSubmit={handleSubmit}
        onDelete={currentClient ? () => currentClient.id && handleDelete(currentClient.id) : undefined}
        isEditing={!!currentClient}
      />
    </div>
  );
}