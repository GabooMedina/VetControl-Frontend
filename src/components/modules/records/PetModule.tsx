import { useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton";
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

const initialPets = [
  {
    id: "1",
    nombre: 'Max',
    especie: 'Perro',
    raza: 'Labrador',
    edad: '3 años',
    peso: '25 kg',
    propietario: 'Juan Pérez'
  },
  {
    id: "2",
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Siamés',
    edad: '2 años',
    peso: '4 kg',
    propietario: 'María González'
  },
  {
    id: "3",
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Pastor Alemán',
    edad: '5 años',
    peso: '30 kg',
    propietario: 'Carlos Rodríguez'
  },
  {
    id: "4",
    nombre: 'Coco',
    especie: 'Ave',
    raza: 'Canario',
    edad: '1 año',
    peso: '0.2 kg',
    propietario: 'Ana Martínez'
  },
  {
    id: "5",
    nombre: 'Nala',
    especie: 'Gato',
    raza: 'Persa',
    edad: '4 años',
    peso: '5 kg',
    propietario: 'Luis Sánchez'
  },
  {
    id: "6",
    nombre: 'Bella',
    especie: 'Perro',
    raza: 'Golden Retriever',
    edad: '2 años',
    peso: '22 kg',
    propietario: 'Laura Fernández'
  },
  {
    id: "7",
    nombre: 'Simba',
    especie: 'Gato',
    raza: 'Maine Coon',
    edad: '3 años',
    peso: '6 kg',
    propietario: 'Pedro López'
  },
  {
    id: "8",
    nombre: 'Toby',
    especie: 'Perro',
    raza: 'Beagle',
    edad: '4 años',
    peso: '12 kg',
    propietario: 'Sofía Ramírez'
  },
  {
    id: "9",
    nombre: 'Milo',
    especie: 'Gato',
    raza: 'Bengalí',
    edad: '1 año',
    peso: '3.5 kg',
    propietario: 'Diego Castro'
  },
  {
    id: "10",
    nombre: 'Lola',
    especie: 'Perro',
    raza: 'Chihuahua',
    edad: '5 años',
    peso: '2.5 kg',
    propietario: 'Valeria Navarro'
  }
];

export function PetModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<any>(null);
  const [pets, setPets] = useState(initialPets);

  const petFields: Field[] = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      required: true
    },
    {
      name: "especie",
      label: "Especie",
      type: "text",
      required: true
    },
    {
      name: "raza",
      label: "Raza",
      type: "text",
      required: true
    },
    {
      name: "edad",
      label: "Edad",
      type: "text",
      required: true
    },
    {
      name: "peso",
      label: "Peso",
      type: "text",
      required: true
    },
    {
      name: "propietario",
      label: "Propietario",
      type: "text",
      required: true
    }
  ];

  const handleCreate = () => {
    setCurrentPet(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pet: any) => {
    setCurrentPet(pet);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setPets(pets.filter(pet => pet.id !== id));
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    if (currentPet) {
      setPets(pets.map(pet =>
        pet.id === currentPet.id ? { ...pet, ...data } : pet
      ));
    } else {
      const newPet = { id: String(pets.length + 1), ...data };
      setPets([...pets, newPet]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Mascotas</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nueva Mascota
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: 'nombre', label: 'Nombre' },
          { name: 'especie', label: 'Especie' },
          { name: 'raza', label: 'Raza' },
          { name: 'edad', label: 'Edad' },
          { name: 'peso', label: 'Peso' },
          { name: 'propietario', label: 'Propietario' }
        ]}
        initialData={pets}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPet ? "Editar Mascota" : "Nueva Mascota"}
        fields={petFields}
        initialData={currentPet || {}}
        onSubmit={handleSubmit}
        onDelete={currentPet ? () => handleDelete(currentPet.id) : undefined}
        isEditing={!!currentPet}
      />
    </div>
  );
}