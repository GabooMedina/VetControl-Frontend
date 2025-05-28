import React from "react";
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO
} from "date-fns";
import { es } from "date-fns/locale";

interface CalendarGridProps {
  currentDate: Date;
  appointments: any[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, appointments }) => {
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      {/* Los botones de mes se manejan fuera de este componente */}
      <h2 className="text-xl font-bold text-gray-700 w-full text-center">
        {format(currentDate, "MMMM yyyy", { locale: es })}
      </h2>
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
            className={`p-2 border border-gray-300 h-28 flex flex-col justify-start items-start overflow-hidden cursor-default ${!isSameMonth(day, monthStart) ? "text-gray-300" : "text-gray-800"} ${isToday ? "bg-green-100 font-semibold" : ""} rounded-md hover:bg-green-50 transition relative`}
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

  return (
    <section className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </section>
  );
};

export default CalendarGrid;
