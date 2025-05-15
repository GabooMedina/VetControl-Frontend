import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Reports = () => {
  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Estadísticas y Reportes</h2></div>

      <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end", marginBottom: "16px" }}>
        <input type="date" defaultValue="2025-01-01" style={{ padding: "8px", borderRadius: "8px" }} />
        <input type="date" defaultValue="2025-05-15" style={{ padding: "8px", borderRadius: "8px" }} />
        <button style={{ backgroundColor: "#14b8a6", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none" }}>
          Exportar
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#6b7280" }}>Ingresos Totales</p>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>Año actual</p>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>$58,600</h2>
          <p style={{ color: "#22c55e", fontSize: "14px" }}>↑ 12% vs año anterior</p>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#6b7280" }}>Pacientes Activos</p>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>Total registrados</p>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>255</h2>
          <p style={{ color: "#22c55e", fontSize: "14px" }}>↑ 8% vs mes anterior</p>
        </div>
        <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "16px" }}>
          <p style={{ color: "#6b7280" }}>Citas Mensuales</p>
          <p style={{ fontSize: "14px", color: "#9ca3af" }}>Promedio</p>
          <h2 style={{ fontSize: "20px", fontWeight: "600" }}>85</h2>
          <p style={{ color: "#22c55e", fontSize: "14px" }}>↑ 5% vs mes anterior</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Ingresos Mensuales</h3>
          <BarChart width={500} height={300} data={ingresosMensuales}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ingreso" fill="#00b9bd" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

        <div style={{ border: "1px solid #ddd", borderRadius: "12px", padding: "16px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>Distribución de Servicios</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={distribucionServicios}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {distribucionServicios.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default Reports;