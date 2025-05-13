import { useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

const initialHistories = [
  {
    id: "1",
    mascota: 'Max',
    propietario: 'Juan Pérez',
    fecha: '14/5/2023',
    diagnostico: 'Infección de oído',
    tratamiento: 'Antibióticos por 7 días',
    veterinario: 'Dr. García'
  },
  {
    id: "2",
    mascota: 'Luna',
    propietario: 'María González',
    fecha: '19/6/2023',
    diagnostico: 'Vacunación anual',
    tratamiento: 'Vacunas múltiples',
    veterinario: 'Dra. Martinez'
  },
  {
    id: "3",
    mascota: 'Rocky',
    propietario: 'Carlos Rodríguez',
    fecha: '9/7/2023',
    diagnostico: 'Dermatitis alérgica',
    tratamiento: 'Corticoides y champú especial',
    veterinario: 'Dr. López'
  },
  {
    id: "4",
    mascota: 'Max',
    propietario: 'Juan Pérez',
    fecha: '4/8/2023',
    diagnostico: 'Control de rutina',
    tratamiento: 'Desparasitación',
    veterinario: 'Dra. Rodríguez'
  },
  {
    id: "5",
    mascota: 'Coco',
    propietario: 'Ana Martinez',
    fecha: '11/9/2023',
    diagnostico: 'Problemas respiratorios',
    tratamiento: 'Nebulizaciones y antibióticos',
    veterinario: 'Dr. García'
  },
  {
    id: "6",
    mascota: 'Bella',
    propietario: 'Laura Fernández',
    fecha: '22/10/2023',
    diagnostico: 'Fractura de pata',
    tratamiento: 'Yeso y reposo',
    veterinario: 'Dra. Martinez'
  },
  {
    id: "7",
    mascota: 'Simba',
    propietario: 'Pedro López',
    fecha: '5/11/2023',
    diagnostico: 'Control postoperatorio',
    tratamiento: 'Analgésicos y revisión',
    veterinario: 'Dr. García'
  },
  {
    id: "8",
    mascota: 'Toby',
    propietario: 'Sofía Ramírez',
    fecha: '18/12/2023',
    diagnostico: 'Alergia alimentaria',
    tratamiento: 'Cambio de dieta',
    veterinario: 'Dra. Rodríguez'
  },
  {
    id: "9",
    mascota: 'Milo',
    propietario: 'Diego Castro',
    fecha: '10/1/2024',
    diagnostico: 'Castración',
    tratamiento: 'Cirugía y cuidados postquirúrgicos',
    veterinario: 'Dr. López'
  },
  {
    id: "10",
    mascota: 'Lola',
    propietario: 'Valeria Navarro',
    fecha: '25/2/2024',
    diagnostico: 'Chequeo general',
    tratamiento: 'Análisis de sangre y vacunas',
    veterinario: 'Dra. Martinez'
  }
];

export function HistoryModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHistory, setCurrentHistory] = useState<any>(null);
  const [histories, setHistories] = useState(initialHistories);

  const historyFields: Field[] = [
    {
      name: "mascota",
      label: "Mascota",
      type: "text",
      required: true
    },
    {
      name: "propietario",
      label: "Propietario",
      type: "text",
      required: true
    },
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
      name: "veterinario",
      label: "Veterinario",
      type: "text",
      required: true
    }
  ];

  const handleCreate = () => {
    setCurrentHistory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (history: any) => {
    setCurrentHistory(history);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setHistories(histories.filter(history => history.id !== id));
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    if (currentHistory) {
      setHistories(histories.map(history =>
        history.id === currentHistory.id ? { ...history, ...data } : history
      ));
    } else {
      const newHistory = { id: String(histories.length + 1), ...data };
      setHistories([...histories, newHistory]);
    }
    setIsModalOpen(false);
  };

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
          { name: 'mascota', label: 'Mascota' },
          { name: 'propietario', label: 'Propietario' },
          { name: 'fecha', label: 'Fecha' },
          { name: 'diagnostico', label: 'Diagnóstico' },
          { name: 'tratamiento', label: 'Tratamiento' },
          { name: 'veterinario', label: 'Veterinario' }
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
        onDelete={currentHistory ? () => handleDelete(currentHistory.id) : undefined}
        isEditing={!!currentHistory}
      />
    </div>
  );
}