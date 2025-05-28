import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const ingresosMensuales = [
  { mes: "Ene", ingreso: 3500 },
  { mes: "Feb", ingreso: 4200 },
  { mes: "Mar", ingreso: 3900 },
  { mes: "Abr", ingreso: 4600 },
  { mes: "May", ingreso: 5200 },
  { mes: "Jun", ingreso: 4900 },
  { mes: "Jul", ingreso: 5600 },
  { mes: "Ago", ingreso: 6200 },
  { mes: "Sep", ingreso: 5900 },
  { mes: "Oct", ingreso: 6500 },
  { mes: "Nov", ingreso: 7000 },
  { mes: "Dic", ingreso: 7700 },
];

const distribucionServicios = [
  { name: "Consultas", value: 35 },
  { name: "Vacunaciones", value: 25 },
  { name: "Cirugías", value: 15 },
  { name: "Peluquería", value: 10 },
  { name: "Otros", value: 15 },
];

const ingresosPorServicio = [
  { name: "Consultas", value: 12000 },
  { name: "Vacunaciones", value: 8000 },
  { name: "Cirugías", value: 15000 },
  { name: "Peluquería", value: 5000 },
  { name: "Otros", value: 8600 },
];

const pacientesPorEspecie = [
  { name: "Perros", value: 140 },
  { name: "Gatos", value: 80 },
  { name: "Aves", value: 15 },
  { name: "Reptiles", value: 10 },
  { name: "Otros", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Reports = () => {
  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Estadísticas y Reportes</h2>
      </div>

      <div className="flex gap-4 justify-end mb-6">
        <input type="date" defaultValue="2025-01-01" className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        <input type="date" defaultValue="2025-05-15" className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400" />
        <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition">Exportar</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start">
          <p className="text-gray-500 font-medium">Ingresos Totales</p>
          <p className="text-sm text-gray-400 mb-1">Año actual</p>
          <h2 className="text-2xl font-bold text-gray-800">$58,600</h2>
          <p className="text-green-500 text-sm font-semibold mt-1">↑ 12% vs año anterior</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start">
          <p className="text-gray-500 font-medium">Pacientes Activos</p>
          <p className="text-sm text-gray-400 mb-1">Total registrados</p>
          <h2 className="text-2xl font-bold text-gray-800">255</h2>
          <p className="text-green-500 text-sm font-semibold mt-1">↑ 8% vs mes anterior</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start">
          <p className="text-gray-500 font-medium">Citas Mensuales</p>
          <p className="text-sm text-gray-400 mb-1">Promedio</p>
          <h2 className="text-2xl font-bold text-gray-800">85</h2>
          <p className="text-green-500 text-sm font-semibold mt-1">↑ 5% vs mes anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Ingresos Mensuales</h3>
          <div className="w-full flex justify-center" style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ingresosMensuales}>
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
          <div className="w-full flex justify-center" style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distribucionServicios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distribucionServicios.map((item) => (
                    <Cell key={`cell-${item.name}`} fill={COLORS[distribucionServicios.findIndex(e => e.name === item.name) % COLORS.length]} />
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
          <div className="w-full flex justify-center" style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ingresosPorServicio}>
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
          <div className="w-full flex justify-center" style={{ minHeight: 260 }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pacientesPorEspecie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#00C49F"
                  dataKey="value"
                >
                  {pacientesPorEspecie.map((item) => (
                    <Cell key={`cell-especie-${item.name}`} fill={COLORS[pacientesPorEspecie.findIndex(e => e.name === item.name) % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;