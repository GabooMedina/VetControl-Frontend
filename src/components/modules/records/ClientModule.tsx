// components/modules/ClientModule.tsx
import { Plus } from "lucide-react";
import { DataTable } from "../../shared/DataTable";
import { PrimaryButton } from "../../shared/PrimaryButton";

const clientes = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    teléfono: '555-1234',
    dirección: 'Calle Principal 123'
  },
  {
    nombre: 'María',
    apellido: 'González',
    email: 'maria@example.com',
    teléfono: '555-5678',
    dirección: 'Avenida Central 456'
  },
  {
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos@example.com',
    teléfono: '555-9012',
    dirección: 'Plaza Mayor 789'
  },
  {
    nombre: 'Ana',
    apellido: 'Martinez',
    email: 'ana@example.com',
    teléfono: '555-3456',
    dirección: 'Calle Secundaria 321'
  },
  {
    nombre: 'Luis',
    apellido: 'Sánchez',
    email: 'luis@example.com',
    teléfono: '555-7890',
    dirección: 'Avenida Norte 654'
  }
];

export function ClientModule() {
  return (
    <div className="space-y-6">
      {/* Encabezado y controles */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Lista de Clientes</h2>
        <PrimaryButton icon={Plus}>
          Nuevo Cliente
        </PrimaryButton>
      </div>

      {/* Tabla de clientes */}
      <DataTable
        headers={['Nombre', 'Apellido', 'Email', 'Teléfono', 'Dirección']}
        data={clientes}
        className="mt-4"
      />
    </div>
  );
}