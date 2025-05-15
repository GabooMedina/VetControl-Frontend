import React, { useState } from "react";
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
  parse,
} from "date-fns";

interface Cita {
  id: number;
  nombre: string;
  fecha: string;
  hora: string;
}

const CalendarModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      nombre: "Consulta médica",
      fecha: format(new Date(), "yyyy-MM-dd"),
      hora: "10:00",
    },
    {
      id: 2,
      nombre: "Reunión de proyecto",
      fecha: format(addDays(new Date(), 2), "yyyy-MM-dd"),
      hora: "14:30",
    },
    {
      id: 3,
      nombre: "Corte de cabello",
      fecha: format(addDays(new Date(), 5), "yyyy-MM-dd"),
      hora: "09:00",
    },
    {
      id: 4,
      nombre: "Control dental",
      fecha: format(subMonths(new Date(), 1), "yyyy-MM-dd"),
      hora: "16:00",
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [nuevaCita, setNuevaCita] = useState<Cita>({
    id: 0,
    nombre: "",
    fecha: "",
    hora: "",
  });
  const [busqueda, setBusqueda] = useState("");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevaCita({
      ...nuevaCita,
      [e.target.name]: e.target.value,
    });
  };

  const agregarCita = () => {
    if (!nuevaCita.nombre || !nuevaCita.fecha || !nuevaCita.hora) {
      alert("Por favor, completa todos los campos");
      return;
    }
    const nueva = {
      ...nuevaCita,
      id: citas.length + 1,
    };
    setCitas([...citas, nueva]);
    setModalOpen(false);
    setNuevaCita({ id: 0, nombre: "", fecha: "", hora: "" });
  };

  const citasHoy = citas.filter(
    (c) => format(new Date(c.fecha), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const citasProximas = citas.filter(
    (c) =>
      format(new Date(c.fecha), "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd")
  );

  const citasFiltradas = citas.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
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
        {format(currentDate, "MMMM yyyy")}
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
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });

    return (
      <div className="grid grid-cols-7 text-center font-semibold border-b border-gray-300 pb-2 mb-2 text-gray-600 uppercase text-xs select-none">
        {[...Array(7)].map((_, i) => (
          <div key={i}>{format(addDays(startDate, i), dateFormat)}</div>
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
        const citasDelDia = citas.filter((c) =>
          isSameDay(parse(c.fecha, "yyyy-MM-dd", new Date()), cloneDay)
        );

        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            className={`p-2 border border-gray-300 h-28 flex flex-col justify-start items-start overflow-hidden cursor-default ${
              !isSameMonth(day, monthStart) ? "text-gray-300" : "text-gray-800"
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
                citasDelDia.map((cita) => (
                  <li
                    key={cita.id}
                    className="mb-0.5 truncate"
                    title={`${cita.nombre} - ${cita.hora}`}
                  >
                    • {cita.nombre} <span className="text-gray-500">({cita.hora})</span>
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

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Citas</h2>

      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar cita por nombre..."
          className="border border-gray-300 p-2 rounded shadow-sm w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar citas"
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow-md transition font-semibold"
          onClick={() => setModalOpen(true)}
          aria-label="Agregar nueva cita"
        >
          Nueva Cita
        </button>
      </div>

      {/* Citas de Hoy */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Citas de Hoy</h3>
        {citasHoy.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {citasHoy.map((c) => (
              <li key={c.id} className="hover:underline cursor-default">
                {c.nombre} - <span className="font-mono">{c.hora}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay citas hoy.</p>
        )}
      </section>

      {/* Citas Próximas */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Citas Próximas</h3>
        {citasProximas.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {citasProximas.map((c) => (
              <li key={c.id} className="hover:underline cursor-default">
                {c.nombre} - <span className="font-mono">{c.fecha}</span> -{" "}
                <span className="font-mono">{c.hora}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No hay citas próximas.</p>
        )}
      </section>

      {/* Calendario */}
      <section className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </section>

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
              <span className="text-gray-700 font-semibold mb-1 block">Nombre</span>
              <input
                type="text"
                name="nombre"
                value={nuevaCita.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Ejemplo: Consulta médica"
                autoFocus
              />
            </label>

            <label className="block mb-3">
              <span className="text-gray-700 font-semibold mb-1 block">Fecha</span>
              <input
                type="date"
                name="fecha"
                value={nuevaCita.fecha}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </label>

            <label className="block mb-5">
              <span className="text-gray-700 font-semibold mb-1 block">Hora</span>
              <input
                type="time"
                name="hora"
                value={nuevaCita.hora}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
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
