import { useState, useEffect, useMemo, useCallback } from "react";
import { CrudModal } from "../../shared/Modal";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";
import { useAppointmentStore } from "../../../store/appointmentStore";
import { fetchAppointments, deleteAppointment, updateAppointment, createAppointment } from "./services/appointmentService";
import { getUsuarios } from "./services/usuarioService";
import { getMascotas } from "./services/mascotaService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "../../shared/StatusBadge";

export function AppointmentModule() {
  const { appointments, setAppointments } = useAppointmentStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

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

  // Cuando se abre el modal para editar, establecer el cliente seleccionado
  useEffect(() => {
    if (isModalOpen) {
      if (selectedAppointment?.usuarioId) {
        setSelectedClientId(selectedAppointment.usuarioId.id ?? selectedAppointment.usuarioId);
      } else {
        setSelectedClientId("");
      }
    }
  }, [isModalOpen, selectedAppointment]);

  // Filtrar mascotas según el cliente seleccionado
  const filteredPetOptions = useMemo(() => {
    if (!selectedClientId) return pets.map(p => ({ label: p.nombre ?? p.name ?? p.id, value: p.id }));
    return pets
      .filter(p => p.usuarioId === selectedClientId || p.usuarioId?.id === selectedClientId)
      .map(p => ({ label: p.nombre ?? p.name ?? p.id, value: p.id }));
  }, [selectedClientId, pets]);

  // Memorizar opciones de selects para evitar recrearlas en cada render
  const clientOptions = useMemo(() =>
    clients.map(c => ({ label: c.nombre ?? c.name ?? c.email ?? c.id, value: c.id })), [clients]);
  const petOptions = useMemo(() =>
    pets.map(p => ({ label: p.nombre ?? p.name ?? p.id, value: p.id })), [pets]);

  // Actualizar el cliente seleccionado al cambiar el select en el modal
  const handleFieldChange = (name: string, value: any) => {
    if (name === "usuarioId") {
      setSelectedClientId(value);
    }
  };

  // Memorizar fields para evitar recreación y actualizar opciones de mascota dinámicamente
  const fields: Field[] = useMemo(() => {
    if (selectedAppointment) {
      // Solo edición: sin cliente ni mascota
      return [
        {
          name: "fecha_hora",
          label: "Fecha y Hora",
          type: "datetime-local",
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
            { label: "Completada", value: "Completada" },
            { label: "Reprogramada", value: "Reprogramada" },
            { label: "No Presentado", value: "NoPresentado" },
          ],
        },
      ];
    }
    // Creación: con cliente y mascota
    return [
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
        options: filteredPetOptions, // <-- Esto depende de selectedClientId
        key: selectedClientId, // <-- Forzar re-render del campo cuando cambia el usuario
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
    ];
  }, [clientOptions, filteredPetOptions, selectedAppointment, selectedClientId]);

  // Optimizar búsqueda de nombre de cliente y mascota
  const getClientName = useCallback((usuarioId: any) => {
    const id = usuarioId?.id ?? usuarioId;
    const c = clients.find(c => c.id === id);
    return c?.nombre ?? c?.name ?? "";
  }, [clients]);
  const getPetName = useCallback((mascotaId: any) => {
    const id = mascotaId?.id ?? mascotaId;
    const p = pets.find(p => p.id === id);
    return p?.nombre ?? p?.name ?? "";
  }, [pets]);

  const handleCreate = () => {
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log("Eliminando cita con ID:", id);
      await deleteAppointment(id);
      // Siempre refrescar desde la API tras eliminar
      const updated = await fetchAppointments();
      setAppointments(updated);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error eliminando cita:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    // Adaptar datos para el store y la API
    let fechaHora = data.fecha_hora;
    if (fechaHora) {
      const d = typeof fechaHora === "string" ? new Date(fechaHora) : fechaHora;
      const pad = (n: number) => n.toString().padStart(2, "0");
      const localISO = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
      fechaHora = localISO;
    }
    const adaptedData = {
      fecha_hora: fechaHora,
      motivo: data.motivo,
      estado: data.estado,
      usuarioId: { id: typeof data.usuarioId === "object" ? data.usuarioId.id : data.usuarioId },
      mascotaId: { id: typeof data.mascotaId === "object" ? data.mascotaId.id : data.mascotaId },
    };
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, adaptedData);
      } else {
        await createAppointment(adaptedData);
      }
      // Siempre refrescar desde la API tras crear/editar
      const updated = await fetchAppointments();
      setAppointments(updated);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error guardando cita:", error);
    }
  };

  // Mejorar UX: mostrar skeletons solo si no hay datos cargados
  const loadingClients = clients.length === 0;
  const loadingPets = pets.length === 0;
  const loadingData = loading || (loadingClients && loadingPets);

  const handleEdit = (appointment: any) => {
    // Normalizar datos para el formulario (asegura que usuarioId y mascotaId sean solo el id)
    setSelectedAppointment({
      ...appointment,
      usuarioId: appointment.usuarioId?.id ?? appointment.usuarioId,
      mascotaId: appointment.mascotaId?.id ?? appointment.mascotaId,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Citas</h2>
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
            {
              name: "fecha_hora",
              label: "Fecha y Hora",
              render: (value: string) =>
                value ? format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es }) : "",
            },
            { name: "motivo", label: "Motivo" },
            { name: "estado", label: "Estado", render: (value) => <StatusBadge estado={value} /> },
          ]}
          initialData={appointments.map(app => ({
            ...app,
            id: app.id ?? (app as any).id_cita,
            clientName: getClientName(app.usuarioId),
            petName: getPetName(app.mascotaId),
          }))}
          onEdit={handleEdit}
          onDelete={handleDelete}
          className="mt-1"
        />
      )}

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAppointment ? "Editar Cita" : "Nueva Cita"}
        fields={fields}
        initialData={selectedAppointment || {}} // Asegura que los datos estén normalizados
        onSubmit={handleSubmit}
        onDelete={selectedAppointment ? () => handleDelete(selectedAppointment.id) : undefined}
        isEditing={!!selectedAppointment}
        onFieldChange={handleFieldChange}
      />
    </div>
  );
}
