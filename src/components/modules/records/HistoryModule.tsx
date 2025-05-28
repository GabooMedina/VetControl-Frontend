import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import {
  MedicalHistory,
  getMedicalHistories,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  getPetsForSelect
} from "../../../services/records/historyService";
import { showToast } from "../../../components/shared/Toast";
import { useNavigate } from "react-router-dom";

export function HistoryModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHistory, setCurrentHistory] = useState<MedicalHistory | null>(null);
  const [histories, setHistories] = useState<MedicalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState<Array<{ value: string, label: string }>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const historiesData = await getMedicalHistories();
        const petsData = await getPetsForSelect();

        setHistories(historiesData);
        setPets(petsData);
      } catch (error: any) {
        console.error("Error completo:", error);
        showToast.error("Error al cargar historiales médicos");

        // Opcional: Mostrar datos vacíos o manejar de otra manera
        setHistories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const historyFields: Field[] = [
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      required: true
    },
    {
      name: "diagnostico",
      label: "Diagnóstico",
      type: "text",
      required: true
    },
    {
      name: "tratamiento",
      label: "Tratamiento",
      type: "text",
      required: true
    },
    {
      name: "notas",
      label: "Notas",
      type: "text",
      required: false
    },
    {
      name: "id_mascota",
      label: "Mascota",
      type: "select",
      required: true,
      options: pets
    }
  ];

  const handleCreate = () => {
    setCurrentHistory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (history: MedicalHistory) => {
    setCurrentHistory({
      ...history,
      id_mascota: history.id_mascota || { id_mascota: "" }
    });
    setIsModalOpen(true);
  };

  const prepareHistoryData = (formData: any): MedicalHistory => {
    // Buscar el nombre de la mascota seleccionada
    const selectedPet = pets.find(p => p.value === formData.id_mascota);

    return {
      ...formData,
      id_mascota: {
        id_mascota: formData.id_mascota,
        nombre: selectedPet?.label // Agregamos el nombre de la mascota
      }
    };
  };

  const handleSubmit = async (formData: any) => {
    try {
      const apiData = prepareHistoryData(formData);

      if (currentHistory && currentHistory.id) {
        const updatedHistory = await updateMedicalHistory(currentHistory.id, apiData);
        setHistories(histories.map(history =>
          history.id === currentHistory.id ? updatedHistory : history
        ));
        showToast.success("Historial actualizado correctamente");
      } else {
        const newHistory = await createMedicalHistory(apiData);
        setHistories([...histories, newHistory]);
        showToast.success("Historial creado correctamente");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else {
        showToast.error(error.response?.data?.message || "Error al guardar el historial");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicalHistory(id);
      setHistories(histories.filter(history => history.id !== id));
      showToast.success("Historial eliminado correctamente");
    } catch (error: any) {
      console.error("Error al eliminar:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        showToast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/login");
      } else {
        showToast.error(error.response?.data?.message || "Error al eliminar el historial");
      }
    }
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-600 text-lg font-medium animate-pulse">
          Cargando Historiales Médicos...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Historiales Médicos</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nuevo Historial
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          {
            name: 'id_mascota',
            label: 'Mascota',
            render: (mascota: any) => {
              // Primero intentar con el nombre directo
              if (mascota?.nombre) return mascota.nombre;

              // Si no tiene nombre, buscar en la lista de mascotas
              if (mascota?.id_mascota) {
                const pet = pets.find(p => p.value === mascota.id_mascota);
                return pet?.label || 'Sin mascota';
              }

              return 'Sin mascota';
            }
          },
          { name: 'fecha', label: 'Fecha' },
          { name: 'diagnostico', label: 'Diagnóstico' },
          { name: 'tratamiento', label: 'Tratamiento' },
          { name: 'notas', label: 'Notas' }
        ]}
        initialData={histories}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentHistory ? "Editar Historial" : "Nuevo Historial"}
        fields={historyFields}
        initialData={currentHistory || {}}
        onSubmit={handleSubmit}
        onDelete={currentHistory ? () => currentHistory.id && handleDelete(currentHistory.id) : undefined}
        isEditing={!!currentHistory}
      />
    </div>
  );
}