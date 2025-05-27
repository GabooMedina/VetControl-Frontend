import React from "react";

interface StatusBadgeProps {
  estado: string;
}

const statusColors: Record<string, string> = {
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Confirmada: "bg-green-100 text-green-800 border-green-300",
  Cancelada: "bg-red-100 text-red-800 border-red-300",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ estado }) => {
  const color = statusColors[estado] || "bg-gray-100 text-gray-800 border-gray-300";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}
    >
      {estado}
    </span>
  );
};
