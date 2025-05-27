import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import { useAppointmentStore } from "../../../store/appointmentStore";
import { fetchAppointments } from "./services/appointmentService";
import { getUsuarios } from "./services/usuarioService";
import { getMascotas } from "./services/mascotaService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function AppointmentModule() {
  const { appointments, setAppointments, addAppointment, editAppointment, deleteAppointment } = useAppointmentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAppointments()
      .then(data => setAppointments(data))
      .catch(err => console.error("Error cargando citas:", err))
      .finally(() => setLoading(false));
  }, [setAppointments]);

  // Cargar usuarios y mascotas en paralelo para mejorar tiempos de carga
  useEffect(() => {
    Promise.all([getUsuarios(), getMascotas()]).then(([resUsuarios, resMascotas]) => {
      if (Array.isArray(resUsuarios)) setClients(resUsuarios);
      else if (resUsuarios && Array.isArray(resUsuarios.data)) setClients(resUsuarios.data);
      else setClients([]);
      if (Array.isArray(resMascotas)) setPets(resMascotas);
      else if (resMascotas && Array.isArray(resMascotas.data)) setPets(resMascotas.data);
      else setPets([]);
    });
  }, []);

  // Memorizar opciones de selects para evitar recrearlas en cada render
  const clientOptions = useMemo(() =>
    clients.map(c => ({ label: c.nombre || c.name || c.email || c.id, value: c.id })), [clients]);
  const petOptions = useMemo(() =>
    pets.map(p => ({ label: p.nombre || p.name || p.id, value: p.id })), [pets]);

  // Memorizar fields para evitar recreación
  const fields: Field[] = useMemo(() => [
    {
      name: "usuarioId",
      label: "Cliente",
      type: "select",
      required: true,
      options: clientOptions,
    },
    {
      name: "mascotaId",
      label: "Mascota",
      type: "select",
      required: true,
      options: petOptions,
    },
    {
      name: "fecha_hora",
      label: "Fecha y Hora",
      type: "date",
      required: true,
    },
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
  ], [clientOptions, petOptions]);

  // Optimizar búsqueda de nombre de cliente y mascota
  const getClientName = useCallback((usuarioId: any) => {
    const id = usuarioId?.id || usuarioId;
    const c = clients.find(c => c.id === id);
    return c?.nombre || c?.name || "";
  }, [clients]);
  const getPetName = useCallback((mascotaId: any) => {
    const id = mascotaId?.id || mascotaId;
    const p = pets.find(p => p.id === id);
    return p?.nombre || p?.name || "";
  }, [pets]);

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
      fecha_hora: data.fecha_hora,
      motivo: data.motivo,
      estado: data.estado,
      usuarioId: { id: typeof data.usuarioId === "object" ? data.usuarioId.id : data.usuarioId },
      mascotaId: { id: typeof data.mascotaId === "object" ? data.mascotaId.id : data.mascotaId },
    };
    if (selectedAppointment) {
      editAppointment(selectedAppointment.id, adaptedData);
    } else {
      addAppointment(adaptedData);
    }
    setIsModalOpen(false);
  };

  // Mejorar UX: mostrar skeletons solo si no hay datos cargados
  const loadingClients = clients.length === 0;
  const loadingPets = pets.length === 0;
  const loadingData = loading || (loadingClients && loadingPets);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Citas</h2>
        <PrimaryButton onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Nueva cita veterinaria
        </PrimaryButton>
      </div>

      {loadingData ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={40} />
          ))}
        </div>
      ) : (
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
      )}

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
