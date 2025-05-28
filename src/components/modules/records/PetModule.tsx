import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import { Pet, getPets, createPet, updatePet, deletePet, getClientsForSelect } from "../../../services/records/petService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";


export function PetModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Array<{ value: string, label: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petsData, clientsData] = await Promise.all([
          getPets(),
          getClientsForSelect()
        ]);
        setPets(petsData);
        setClients(clientsData);
      } catch (error: any) {
        if (error.response?.status === 401) {
          showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
          navigate("/login");
        } else {
          showToast.error("Error al cargar los datos");
          console.error("Failed to fetch data:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Campos para el DataTable (sin transformación)
  const tableFields = [
    { name: 'nombre', label: 'Nombre' },
    { name: 'especie', label: 'Especie' },
    { name: 'raza', label: 'Raza' },
    { name: 'sexo', label: 'Sexo' },
    { name: 'color', label: 'Color' }
  ];

  const petFields: Field[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true
    },
    {
      name: "especie",
      label: "Especie",
      type: "text",
      required: true
    },
    {
      name: "raza",
      label: "Raza",
      type: "text",
      required: true
    },
    {
      name: "sexo",
      label: "Sexo",
      type: "select",
      required: true,
      options: [
        { value: "Macho", label: "Macho" },
        { value: "Hembra", label: "Hembra" }
      ]
    },
    {
      name: "fecha_nacimiento",
      label: "Fecha de Nacimiento",
      type: "date",
      required: true
    },
    {
      name: "color",
      label: "Color",
      type: "text",
      required: true
    },
    {
      name: "id_cliente",
      label: "Propietario",
      type: "select",
      required: false, // No requerido si no se va a mostrar
      options: clients
    }

  ];

  const handleCreate = () => {
    setCurrentPet(null);
    setIsModalOpen(true);
  };

const handleEdit = (pet: Pet) => {
    let normalizedIdCliente: string | null = null;
    
    if (pet.id_cliente !== null && pet.id_cliente !== undefined) {
        normalizedIdCliente = typeof pet.id_cliente === 'string' 
            ? pet.id_cliente 
            : pet.id_cliente.id_cliente;
    }
    
    setCurrentPet({
        ...pet,
        id_cliente: normalizedIdCliente
    });
    setIsModalOpen(true);
};

const preparePetData = (formData: any): Pet => {
    return {
        ...formData,
        id_cliente: formData.id_cliente || null
    };
};

  const handleSubmit = async (formData: any) => {
    try {
      const apiData = preparePetData(formData);

      if (currentPet && currentPet.id) {
        const updatedPet = await updatePet(currentPet.id, apiData);
        setPets(pets.map(pet =>
          pet.id === currentPet.id ? updatedPet : pet
        ));
        showToast.success("Mascota Actualizada Correctamente");
      } else {
        const newPet = await createPet(apiData);
        setPets([...pets, newPet]);
        showToast.success("Mascota Creada Correctamente");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error completo:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else {
        showToast.error(error.response?.data?.message || "Error al guardar la mascota");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePet(id);
      setPets(pets.filter(pet => pet.id !== id));
      showToast.success("Mascota Eliminada Correctamente");
    } catch (error: any) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else {
        showToast.error(error.response?.data?.message || "Error al eliminar la mascota");
      }
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Cargando Mascotas...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Mascotas</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nueva Mascota
        </PrimaryButton>
      </div>

      <DataTable
        fields={tableFields}
        initialData={pets}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPet ? "Editar Mascota" : "Nueva Mascota"}
        fields={petFields}
        initialData={currentPet || {}}
        onSubmit={handleSubmit}
        onDelete={currentPet ? () => currentPet.id && handleDelete(currentPet.id) : undefined}
        isEditing={!!currentPet}
      />
    </div>
  );
}