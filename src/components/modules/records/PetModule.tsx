import { Plus } from "lucide-react";
import { DataTable } from "../../shared/DataTable";
import { PrimaryButton } from "../../shared/PrimaryButton";

const mascotas = [
    {
        nombre: 'Max',
        especie: 'Perro',
        raza: 'Labrador',
        edad: '3 años',
        peso: '25 kg',
        propietario: 'Juan Pérez'
    },
    {
        nombre: 'Luna',
        especie: 'Gato',
        raza: 'Siamés',
        edad: '2 años',
        peso: '4 kg',
        propietario: 'María González'
    },
    {
        nombre: 'Rocky',
        especie: 'Perro',
        raza: 'Pastor Alemán',
        edad: '5 años',
        peso: '30 kg',
        propietario: 'Carlos Rodríguez'
    },
    {
        nombre: 'Coco',
        especie: 'Ave',
        raza: 'Canario',
        edad: '1 año',
        peso: '0.2 kg',
        propietario: 'Ana Martínez'
    },
    {
        nombre: 'Nala',
        especie: 'Gato',
        raza: 'Persa',
        edad: '4 años',
        peso: '5 kg',
        propietario: 'Luis Sánchez'
    }
];

export function PetModule() {
    return (
        <div className="space-y-6">
            {/* Encabezado y controles */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Lista de Mascotas</h2>
                <PrimaryButton icon={Plus}>
                    Nueva Mascota
                </PrimaryButton>
            </div>

            {/* Tabla de mascotas */}
            <DataTable
                headers={['NOMBRE', 'ESPECIE', 'RAZA', 'EDAD', 'PESO', 'PROPIETARIO']}
                data={mascotas.map(m => ({
                    nombre: m.nombre,
                    especie: m.especie,
                    raza: m.raza,
                    edad: m.edad,
                    peso: m.peso,
                    propietario: m.propietario
                }))}
                className="mt-4"
            />
        </div>
    );
}