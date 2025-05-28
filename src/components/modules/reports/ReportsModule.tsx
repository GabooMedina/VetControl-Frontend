import { useState } from "react";

const tiposReporte = [
  { value: "ingresos", label: "Ingresos" },
  { value: "servicios", label: "Servicios" },
  { value: "pacientes", label: "Pacientes" },
  { value: "citas", label: "Citas" },
];

const Reportes = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("");

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h1>
      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-col">
          <label htmlFor="fecha-inicio" className="text-gray-600 font-medium mb-1">Fecha inicio</label>
          <input
            id="fecha-inicio"
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="fecha-fin" className="text-gray-600 font-medium mb-1">Fecha fin</label>
          <input
            id="fecha-fin"
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="tipo-reporte" className="text-gray-600 font-medium mb-1">Tipo de reporte</label>
          <select
            id="tipo-reporte"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">Todos</option>
            {tiposReporte.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition mt-4 md:mt-6">Filtrar</button>
      </div>
      {/* Aquí se mostrarán los reportes filtrados según los criterios seleccionados */}
      <div className="bg-white rounded-2xl shadow p-8 text-gray-500 text-center">
        <p>Selecciona un rango de fechas y tipo de reporte para ver los resultados.</p>
      </div>
    </div>
  );
};

export default Reportes;