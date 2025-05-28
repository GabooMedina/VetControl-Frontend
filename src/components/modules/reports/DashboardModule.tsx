import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

// Generador de datos coherentes tipo base de datos
const servicios = ["Consultas", "Vacunaciones", "Cirugías", "Peluquería", "Otros"];
const especies = ["Perros", "Gatos", "Aves", "Reptiles", "Otros"];

function generarDatosDB(anios: number[], meses: { label: string; value: string }[]) {
  const data: Record<number, Record<string, any>> = {};
  anios.forEach(anio => {
    data[anio] = {};
    meses.forEach((mes, idxMes) => {
      // Pacientes por especie
      const pacientes = especies.map((esp, idx) => ({
        name: esp,
        value: 60 + Math.floor(Math.abs(Math.sin(anio + idxMes + idx) * 40))
      }));
      // Total pacientes
      const totalPacientes = pacientes.reduce((acc, cur) => acc + cur.value, 0);
      // Distribución de servicios (en %)
      const distServicios = servicios.map((srv, idx) => ({
        name: srv,
        value: 10 + Math.floor(Math.abs(Math.cos(anio + idxMes + idx) * 30))
      }));
      // Total atenciones
      const totalAtenciones = distServicios.reduce((acc, cur) => acc + cur.value, 0);
      // Ingresos por servicio
      const ingresosPorServicio = distServicios.map((srv, idx) => ({
        name: srv.name,
        value: (srv.value * (200 + idx * 100 + (anio - anios[0]) * 50 + idxMes * 20))
      }));
      // Total ingresos
      const totalIngresos = ingresosPorServicio.reduce((acc, cur) => acc + cur.value, 0);
      data[anio][mes.value] = {
        mes: mes.label.slice(0, 3),
        ingresos: totalIngresos,
        ingresosPorServicio,
        distribucionServicios: distServicios,
        pacientesPorEspecie: pacientes,
        totalPacientes,
        totalAtenciones
      };
    });
  });
  return data;
}

const anios = [2023, 2024, 2025];
const meses = [
  { label: "Enero", value: "01" },
  { label: "Febrero", value: "02" },
  { label: "Marzo", value: "03" },
  { label: "Abril", value: "04" },
  { label: "Mayo", value: "05" },
  { label: "Junio", value: "06" },
  { label: "Julio", value: "07" },
  { label: "Agosto", value: "08" },
  { label: "Septiembre", value: "09" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];
const db = generarDatosDB(anios, meses);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Para los colores de celdas, usar los arrays base de servicios y especies
const getColorServicio = (name: string) => {
  const idx = servicios.findIndex((e: string) => e === name);
  return COLORS[idx % COLORS.length];
};
const getColorEspecie = (name: string) => {
  const idx = especies.findIndex((e: string) => e === name);
  return COLORS[idx % COLORS.length];
};

const Dashboard = () => {
  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState("2025-01-01");
  const [fechaFin, setFechaFin] = useState("2025-05-15");
  const [vista, setVista] = useState("mensual"); // mensual o anual
  const [mesSeleccionado, setMesSeleccionado] = useState("01");
  const [anioSeleccionado, setAnioSeleccionado] = useState(2025);

  // Datos para gráficos
  const datosAnio = db[anioSeleccionado];
  const datosMes = datosAnio[mesSeleccionado];

  // Ingresos mensuales del año seleccionado
  const ingresosMensuales = meses.map(m => ({
    mes: m.label.slice(0, 3),
    ingreso: datosAnio[m.value].ingresos
  }));
  // Ingresos por año
  const ingresosPorAnio = anios.map(anio => ({
    anio: anio.toString(),
    ingreso: meses.reduce((acc, m) => acc + db[anio][m.value].ingresos, 0)
  }));

  // Calcular datos anuales agregados para la vista anual
  const datosAnuales = {
    distribucionServicios: servicios.map((srv) => ({
      name: srv,
      value: meses.reduce((acc, m) => acc + db[anioSeleccionado][m.value].distribucionServicios.find((d: any) => d.name === srv)?.value || 0, 0)
    })),
    ingresosPorServicio: servicios.map((srv) => ({
      name: srv,
      value: meses.reduce((acc, m) => acc + db[anioSeleccionado][m.value].ingresosPorServicio.find((d: any) => d.name === srv)?.value || 0, 0)
    })),
    pacientesPorEspecie: especies.map((esp) => ({
      name: esp,
      value: meses.reduce((acc, m) => acc + db[anioSeleccionado][m.value].pacientesPorEspecie.find((d: any) => d.name === esp)?.value || 0, 0)
    })),
  };

  // Ingresos para gráfico principal
  const ingresosParaGrafico = vista === "anual"
    ? [{ mes: anioSeleccionado.toString(), ingreso: ingresosPorAnio.find(i => i.anio === anioSeleccionado.toString())?.ingreso || 0 }]
    : [{ mes: datosMes.mes, ingreso: datosMes.ingresos }];

  // Otros datos para gráficos
  const distribucionServiciosFiltrada = datosMes.distribucionServicios;
  const ingresosPorServicioFiltrado = datosMes.ingresosPorServicio;
  const pacientesPorEspecieFiltrado = datosMes.pacientesPorEspecie;
  const ingresosMensualesPorAnio = ingresosMensuales;

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Estadísticas y Reportes</h2>
      </div>

      <div className="flex gap-4 justify-end mb-6">
        <input
          type="date"
          value={fechaInicio}
          onChange={e => setFechaInicio(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={e => setFechaFin(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <select
          value={vista}
          onChange={e => setVista(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="mensual">Vista Mensual</option>
          <option value="anual">Vista Anual</option>
        </select>
        {vista === "mensual" && (
          <select
            value={mesSeleccionado}
            onChange={e => setMesSeleccionado(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {meses.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        )}
        {vista === "anual" && (
          <select
            value={anioSeleccionado}
            onChange={e => setAnioSeleccionado(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {anios.map(anio => (
              <option key={anio} value={anio}>{anio}</option>
            ))}
          </select>
        )}
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition">Exportar</button>
      </div>

      {vista === "mensual" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos Mensuales</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ingresosParaGrafico}>
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="ingreso" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Servicios</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={distribucionServiciosFiltrada}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribucionServiciosFiltrada.map((item: { name: string; value: number }) => (
                        <Cell key={`cell-${item.name}`} fill={getColorServicio(item.name)} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos por Servicio</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ingresosPorServicioFiltrado}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Pacientes por Especie</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pacientesPorEspecieFiltrado}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#00C49F"
                      dataKey="value"
                    >
                      {pacientesPorEspecieFiltrado.map((item: { name: string; value: number }) => (
                        <Cell key={`cell-especie-${item.name}`} fill={getColorEspecie(item.name)} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos por Año</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ingresosPorAnio}>
                    <XAxis dataKey="anio" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="ingreso" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos por Mes ({anioSeleccionado})</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={ingresosMensualesPorAnio}>
                    <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="ingreso" fill="#00C49F" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Distribución de Servicios (Anual)</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={datosAnuales.distribucionServicios}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datosAnuales.distribucionServicios.map((item: { name: string; value: number }) => (
                        <Cell key={`cell-${item.name}`} fill={getColorServicio(item.name)} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos por Servicio (Anual)</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={datosAnuales.ingresosPorServicio}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Pacientes por Especie (Anual)</h3>
              <div className="w-full flex justify-center" style={{ minHeight: 280 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={datosAnuales.pacientesPorEspecie}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#00C49F"
                      dataKey="value"
                    >
                      {datosAnuales.pacientesPorEspecie.map((item: { name: string; value: number }) => (
                        <Cell key={`cell-especie-${item.name}`} fill={getColorEspecie(item.name)} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;