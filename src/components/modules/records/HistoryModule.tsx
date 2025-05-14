import { Plus } from "lucide-react";
import { DataTable } from "../../shared/DataTable";
import { PrimaryButton } from "../../shared/PrimaryButton";

const historiales = [
  {
    mascota: 'Max',
    propietario: 'Juan Pérez',
    fecha: '14/5/2023',
    diagnóstico: 'Infección de oído',
    tratamiento: 'Antibióticos por 7 días',
    veterinario: 'Dr. García'
  },
  {
    mascota: 'Luna',
    propietario: 'María González',
    fecha: '19/6/2023',
    diagnóstico: 'Vacunación anual',
    tratamiento: 'Vacunas múltiples',
    veterinario: 'Dra. Martinez'
  },
  {
    mascota: 'Rocky',
    propietario: 'Carlos Rodríguez',
    fecha: '9/7/2023',
    diagnóstico: 'Dermatitis alérgica',
    tratamiento: 'Corticoides y champú especial',
    veterinario: 'Dr. López'
  },
  {
    mascota: 'Max',
    propietario: 'Juan Pérez',
    fecha: '4/8/2023',
    diagnóstico: 'Control de rutina',
    tratamiento: 'Desparasitación',
    veterinario: 'Dra. Rodríguez'
  },
  {
    mascota: 'Coco',
    propietario: 'Ana Martinez',
    fecha: '11/9/2023',
    diagnóstico: 'Problemas respiratorios',
    tratamiento: 'Nebulizaciones y antibióticos',
    veterinario: 'Dr. García'
  }
];

export function HistoryModule() {
  return (
    <div className="space-y-6">
      {/* Encabezado y controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Historiales Médicos</h2>
        <PrimaryButton icon={Plus}>
          Nuevo Historial
        </PrimaryButton>
      </div>

      {/* Tabla de historiales médicos */}
      <DataTable
        headers={['MASCOTA', 'PROPIETARIO', 'FECHA', 'DIAGNÓSTICO', 'TRATAMIENTO', 'VETERINARIO']}
        data={historiales}
        className="mt-4"
      />
    </div>
  );
}