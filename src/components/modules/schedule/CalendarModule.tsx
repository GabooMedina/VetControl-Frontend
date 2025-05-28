import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { parseISO } from "date-fns";
import { useAppointmentStore } from "../../../store/appointmentStore";
import { showToast } from "../../shared/Toast";
import { getUsuarios } from "./services/usuarioService";
import { getMascotas } from "./services/mascotaService";
import { createAppointment, fetchAppointments } from "./services/appointmentService";
import { PrimaryButton } from "../../shared/PrimaryButton";
import { Plus } from "lucide-react";
import { CalendarDays, Clock } from 'lucide-react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CalendarGrid from "./CalendarGrid";

const CalendarModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mascotas, setMascotas] = useState<any[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  // Zustand store
  const { appointments, addAppointment, setAppointments } = useAppointmentStore();

  // Estado local para nueva cita (estructura backend)
  const [nuevaCita, setNuevaCita] = useState({
    fecha_hora: "",
    motivo: "",
    estado: "Pendiente",
    usuarioId: { id: "" },
    mascotaId: { id: "" },
  });

  useEffect(() => {
    if (modalOpen) {
      getUsuarios().then((res) => {
        if (Array.isArray(res)) setUsuarios(res);
        else if (res && Array.isArray(res.data)) setUsuarios(res.data);
        else setUsuarios([]);
      });
      getMascotas().then((res) => {
        if (Array.isArray(res)) setMascotas(res);
        else if (res && Array.isArray(res.data)) setMascotas(res.data);
        else setMascotas([]);
      });
    }
  }, [modalOpen]);

  useEffect(() => {
  getUsuarios().then((res) => {
    if (Array.isArray(res)) setUsuarios(res);
    else if (res && Array.isArray(res.data)) setUsuarios(res.data);
    else setUsuarios([]);
  });
  getMascotas().then((res) => {
    if (Array.isArray(res)) setMascotas(res);
    else if (res && Array.isArray(res.data)) setMascotas(res.data);
    else setMascotas([]);
  });
}, []);


useEffect(() => {
  if (usuarios.length > 0 && mascotas.length > 0) {
    setLoadingCitas(true);
    fetchAppointments()
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
        else if (data && Array.isArray(data.data)) setAppointments(data.data);
        else setAppointments([]);
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoadingCitas(false));
  }
}, [usuarios, mascotas]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaCita({
      ...nuevaCita,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNuevaCita({ ...nuevaCita, usuarioId: { id: e.target.value } });
  };
  const handlePetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNuevaCita({ ...nuevaCita, mascotaId: { id: e.target.value } });
  };

  const agregarCita = async () => {
    if (!nuevaCita.motivo || !nuevaCita.fecha_hora || !nuevaCita.usuarioId.id || !nuevaCita.mascotaId.id) {
      showToast.error("Por favor, completa todos los campos");
      return;
    }
    try {
      // Convertir la fecha local a UTC antes de enviarla al backend
      const fechaUTC = new Date(nuevaCita.fecha_hora).toISOString();
      const citaCreada = await createAppointment({
        ...nuevaCita,
        fecha_hora: fechaUTC,
      });
      addAppointment(citaCreada); // Actualiza Zustand con la cita real del backend
      setModalOpen(false);
      setNuevaCita({ fecha_hora: "", motivo: "", estado: "Pendiente", usuarioId: { id: "" }, mascotaId: { id: "" } });
      showToast.success("Cita agregada correctamente");
    } catch (error) {
      showToast.error("Error al crear la cita");
    }
  };

  // Filtrado y agrupación
  const citasHoy = appointments.filter(
    (c) => format(new Date(c.fecha_hora), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );
  const citasProximas = appointments.filter(
    (c) => format(new Date(c.fecha_hora), "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd")
  );
  const citasFiltradas = appointments.filter((c) =>
    c.motivo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={prevMonth}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        aria-label="Mes anterior"
      >
        ←
      </button>
      <h2 className="text-xl font-bold text-gray-700">
        {format(currentDate, "MMMM yyyy", { locale: es })}
      </h2>
      <button
        onClick={nextMonth}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        aria-label="Mes siguiente"
      >
        →
      </button>
    </div>
  );

  const renderDays = () => {
    const dateFormat = "eee";
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0, locale: es });
    return (
      <div className="grid grid-cols-7 text-center font-semibold border-b border-gray-300 pb-2 mb-2 text-gray-600 uppercase text-xs select-none">
        {[...Array(7)].map((_, i) => (
          <div key={i}>{format(addDays(startDate, i), dateFormat, { locale: es })}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const citasDelDia = appointments.filter((c) =>
          isSameDay(parseISO(c.fecha_hora), cloneDay)
        );

        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            className={`p-2 border border-gray-300 h-28 flex flex-col justify-start items-start overflow-hidden cursor-default ${!isSameMonth(day, monthStart) ? "text-gray-300" : "text-gray-800"
              } ${isToday ? "bg-green-100 font-semibold" : ""} rounded-md hover:bg-green-50 transition relative`}
            key={day.toString()}
            title={format(day, "PPPP")}
          >
            <div className="flex justify-between w-full items-center mb-1">
              <span className="font-semibold">{format(day, "d")}</span>
              {isToday && (
                <span className="text-xs bg-green-500 text-white px-1 rounded select-none">
                  Hoy
                </span>
              )}
            </div>

            <ul className="text-xs overflow-y-auto max-h-20 w-full">
              {citasDelDia.length > 0 ? (
                citasDelDia.map((cita, idx) => (
                  <li
                    key={cita.id || idx}
                    className="mb-0.5 truncate flex items-center gap-1"
                    title={`${cita.motivo} - ${format(parseISO(cita.fecha_hora), "HH:mm")}`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${cita.estado === "Pendiente"
                      ? "bg-yellow-400"
                      : cita.estado === "Confirmada"
                        ? "bg-green-500"
                        : "bg-red-400"
                      }`}></span>
                    {cita.motivo} <span className="text-gray-500">({format(parseISO(cita.fecha_hora), "HH:mm")})</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-300 italic select-none">Sin citas</li>
              )}
            </ul>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }

    return <div>{rows}</div>;
  };

  // Skeleton component usando react-loading-skeleton
  const SkeletonCita = () => (
    <li className="bg-gray-100 border-l-4 border-gray-300 rounded-md shadow p-3 flex flex-col">
      <Skeleton height={20} width={96} className="mb-2" />
      <Skeleton height={16} width={160} className="mb-2" />
      <Skeleton height={16} width={64} className="self-end" />
    </li>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Citas</h2>


      {/* Citas de Hoy */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-green-600" />
          Hoy
        </h3>
        {loadingCitas ? (
          <ul className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCita key={i} />)}
          </ul>
        ) : citasHoy.length > 0 ? (
          <ul className="space-y-3">
            {citasHoy.map((c) => {
              const usuarioObj = usuarios.find(u => u.id === (c.usuarioId?.id || c.usuarioId));
              const usuario = usuarioObj ? `${usuarioObj.nombre || ''} ${usuarioObj.apellido || ''}`.trim() : c.usuarioId?.id || c.usuarioId;
              const mascota = mascotas.find(m => m.id === (c.mascotaId?.id || c.mascotaId))?.nombre || c.mascotaId?.id || c.mascotaId;
              return (
                <li key={c.id} className="bg-white border-l-4 border-green-500 rounded-md shadow p-3 flex flex-col">
                  <span className="flex items-center gap-1 text-green-700 font-bold text-lg mb-1">{format(parseISO(c.fecha_hora), "HH:mm")}</span>
                  <span className="text-gray-800 font-medium truncate">{usuario} - {mascota} {c.motivo && `(${c.motivo})`}</span>
                  <span className={`mt-2 self-end text-xs px-2 py-0.5 rounded-full ${c.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : c.estado === "Confirmada" ? "bg-green-100 text-green-800 border-green-300" : c.estado === "Cancelada" ? "bg-red-100 text-red-800 border-red-300" : c.estado === "Completada" ? "bg-blue-100 text-blue-800 border-blue-300" : c.estado === "Reprogramada" ? "bg-purple-100 text-purple-800 border-purple-300" : c.estado === "NoPresentado" ? "bg-gray-100 text-gray-800 border-gray-300" : "bg-gray-100 text-gray-800 border-gray-300"}`}>{c.estado}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay citas hoy.</p>
        )}
      </section>

      {/* Citas Próximas */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Próximas citas
        </h3>
        {loadingCitas ? (
          <ul className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => <SkeletonCita key={i} />)}
          </ul>
        ) : citasProximas.length > 0 ? (
          <ul className="space-y-3">
            {citasProximas.map((c) => {
              const usuarioObj = usuarios.find(u => u.id === (c.usuarioId?.id || c.usuarioId));
              const usuario = usuarioObj ? `${usuarioObj.nombre || ''} ${usuarioObj.apellido || ''}`.trim() : c.usuarioId?.id || c.usuarioId;
              const mascota = mascotas.find(m => m.id === (c.mascotaId?.id || c.mascotaId))?.nombre || c.mascotaId?.id || c.mascotaId;
              return (
                <li key={c.id} className="bg-white border-l-4 border-blue-500 rounded-md shadow p-3 flex flex-col">
                  <span className="flex items-center gap-1 text-blue-700 font-bold text-lg mb-1">{format(parseISO(c.fecha_hora), "dd MMMM", { locale: es })} - {format(parseISO(c.fecha_hora), "HH:mm")}</span>
                  <span className="text-gray-800 font-medium truncate">{usuario} - {mascota} {c.motivo && `(${c.motivo})`}</span>
                  <span className={`mt-2 self-end text-xs px-2 py-0.5 rounded-full ${c.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800 border border-yellow-300" : c.estado === "Confirmada" ? "bg-green-100 text-green-800 border border-green-300" : c.estado === "Cancelada" ? "bg-red-100 text-red-800 border border-red-300" : c.estado === "Completada" ? "bg-blue-100 text-blue-800 border border-blue-300" : c.estado === "Reprogramada" ? "bg-purple-100 text-purple-800 border border-purple-300" : c.estado === "NoPresentado" ? "bg-gray-100 text-gray-800 border border-gray-300" : "bg-gray-100 text-gray-800 border border-gray-300"}`}>{c.estado}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay citas próximas.</p>
        )}
      </section>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4">
        <PrimaryButton onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nueva cita veterinaria
        </PrimaryButton>
      </div>

      {/* Calendario */}
      <CalendarGrid 
        currentDate={currentDate} 
        appointments={appointments} 
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      {/* Modal para agregar cita */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <h3
              id="modal-title"
              className="text-lg font-bold mb-4 text-gray-700 text-center"
            >
              Agregar Nueva Cita
            </h3>
            <label className="block mb-3">
              <span className="text-gray-700 font-semibold mb-1 block">Motivo</span>
              <input
                type="text"
                name="motivo"
                value={nuevaCita.motivo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Ejemplo: Consulta médica"
                autoFocus
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-700 font-semibold mb-1 block">Fecha y Hora</span>
              <input
                type="datetime-local"
                name="fecha_hora"
                value={nuevaCita.fecha_hora}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-700 font-semibold mb-1 block">Usuario</span>
              <select
                name="usuarioId"
                value={nuevaCita.usuarioId.id}
                onChange={handleUserChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre || u.email || u.id}</option>
                ))}
              </select>
            </label>
            <label className="block mb-5">
              <span className="text-gray-700 font-semibold mb-1 block">Mascota</span>
              <select
                name="mascotaId"
                value={nuevaCita.mascotaId.id}
                onChange={handlePetChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Selecciona una mascota</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>{m.nombre || m.id}</option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={agregarCita}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModule;
