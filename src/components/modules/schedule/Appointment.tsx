import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import { useAppointmentStore } from "../../../store/appointmentStore";
import { fetchAppointments } from "./services/appointmentService";

const mockClients = [
  { id: "1", name: "Juan Pérez" },
  { id: "2", name: "María González" },
  { id: "3", name: "Carlos Rodríguez" },
  { id: "4", name: "Ana Martínez" },
  { id: "5", name: "Luis Sánchez" },
];

const mockPets = [
  { id: "1", name: "Max", species: "Perro", clientId: "1" },
  { id: "2", name: "Luna", species: "Gato", clientId: "2" },
  { id: "3", name: "Rocky", species: "Perro", clientId: "3" },
  { id: "4", name: "Coco", species: "Ave", clientId: "4" },
  { id: "5", name: "Nala", species: "Gato", clientId: "5" },
];

export function AppointmentModule() {
  const { appointments, setAppointments, addAppointment, editAppointment, deleteAppointment } = useAppointmentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const fields: Field[] = [
    {
      name: "usuarioId",
      label: "Cliente",
      type: "select",
      required: true,
      options: mockClients.map(c => ({ label: c.name, value: c.id })),
    },
    {
      name: "mascotaId",
      label: "Mascota",
      type: "select",
      required: true,
      options: mockPets.map(p => ({ label: p.name, value: p.id })),
    },
    { name: "fecha_hora", label: "Fecha y Hora", type: "text", required: true },
    { name: "motivo", label: "Motivo", type: "text", required: true },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Confirmada", value: "Confirmada" },
        { label: "Cancelada", value: "Cancelada" },
      ],
    },
  ];

  useEffect(() => {
    fetchAppointments()
      .then(data => setAppointments(data))
      .catch(err => console.error("Error cargando citas:", err));
  }, [setAppointments]);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteAppointment(id);
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    // Adaptar datos para el store y la API
    const adaptedData = {
      ...data,
      usuarioId: { id: data.usuarioId },
      mascotaId: { id: data.mascotaId },
    };
    if (selectedAppointment) {
      editAppointment(selectedAppointment.id, adaptedData);
    } else {
      addAppointment(adaptedData);
    }
    setIsModalOpen(false);
  };

  const getClientName = (usuarioId: any) =>
    mockClients.find(c => c.id === (usuarioId?.id || usuarioId))?.name || "";
  const getPetName = (mascotaId: any) =>
    mockPets.find(p => p.id === (mascotaId?.id || mascotaId))?.name || "";

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Citas</h2>
        <PrimaryButton onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Nueva cita veterinaria
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: "clientName", label: "Cliente" },
          { name: "petName", label: "Mascota" },
          { name: "fecha_hora", label: "Fecha y Hora" },
          { name: "motivo", label: "Motivo" },
          { name: "estado", label: "Estado" },
        ]}
        initialData={appointments.map(app => ({
          ...app,
          clientName: getClientName(app.usuarioId),
          petName: getPetName(app.mascotaId),
        }))}
        onEdit={handleEdit}
        onDelete={id => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAppointment ? "Editar Cita" : "Nueva Cita"}
        fields={fields}
        initialData={selectedAppointment || {}}
        onSubmit={handleSubmit}
        onDelete={selectedAppointment ? () => handleDelete(selectedAppointment.id) : undefined}
        isEditing={!!selectedAppointment}
      />
    </div>
  );
}
