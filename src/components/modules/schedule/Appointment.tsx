import { useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

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

const initialAppointments = [
  {
    id: "1",
    clientId: "1",
    petId: "1",
    date: "2023-10-15",
    time: "09:00",
    reason: "Vacunación anual",
    notes: "Primera dosis",
    status: "Confirmada",
    duration: 30,
  },
  {
    id: "2",
    clientId: "2",
    petId: "2",
    date: "2023-10-16",
    time: "10:30",
    reason: "Control de rutina",
    notes: "",
    status: "Pendiente",
    duration: 45,
  },
];

export function AppointmentModule() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const fields: Field[] = [
    {
      name: "clientId",
      label: "Cliente",
      type: "select",
      required: true,
      options: mockClients.map(c => ({ label: c.name, value: c.id }))
    },
    {
      name: "petId",
      label: "Mascota",
      type: "select",
      required: true,
      options: selectedAppointment?.clientId
        ? mockPets
            .filter(p => p.clientId === selectedAppointment.clientId)
            .map(p => ({ label: p.name, value: p.id }))
        : []
    },
    { name: "date", label: "Fecha", type: "date", required: true },
    { name: "time", label: "Hora", type: "time", required: true },
    { name: "reason", label: "Motivo", type: "text", required: true },
    { name: "notes", label: "Notas", type: "textarea", required: false },
    {
      name: "status",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { label: "Pendiente", value: "Pendiente" },
        { label: "Confirmada", value: "Confirmada" },
        { label: "Cancelada", value: "Cancelada" }
      ]
    },
    { name: "duration", label: "Duración (min)", type: "number", required: true },
  ];

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    if (selectedAppointment) {
      setAppointments(appointments.map(app =>
        app.id === selectedAppointment.id ? { ...app, ...data } : app
      ));
    } else {
      const newAppointment = {
        id: String(appointments.length + 1),
        ...data
      };
      setAppointments([...appointments, newAppointment]);
    }
    setIsModalOpen(false);
  };

  const getClientName = (id: string) => mockClients.find(c => c.id === id)?.name || "";
  const getPetName = (id: string) => mockPets.find(p => p.id === id)?.name || "";

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Citas</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nueva Cita
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: "clientName", label: "Cliente" },
          { name: "petName", label: "Mascota" },
          { name: "date", label: "Fecha" },
          { name: "time", label: "Hora" },
          { name: "reason", label: "Motivo" },
          { name: "status", label: "Estado" }
        ]}
        initialData={appointments.map(app => ({
          ...app,
          clientName: getClientName(app.clientId),
          petName: getPetName(app.petId)
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
