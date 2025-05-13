import { useState } from "react";
import { Plus } from "lucide-react";
import { CrudModal } from "../../shared/Modal";
import { PrimaryButton } from "../../shared/PrimaryButton"
import DataTable from "../../shared/DataTable";
import { Field } from "../../../Interfaces/TypesData";

const mockClients = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
    phone: "555-1234",
    address: "Calle Principal 123",
  },
  {
    id: "2",
    firstName: "María",
    lastName: "Gómez",
    email: "maria.gomez@example.com",
    phone: "555-2345",
    address: "Av. Central 456",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Ramírez",
    email: "carlos.r@example.com",
    phone: "555-3456",
    address: "Calle 5 de Junio 78",
  },
  {
    id: "4",
    firstName: "Lucía",
    lastName: "Martínez",
    email: "lucia.m@example.com",
    phone: "555-4567",
    address: "Av. Libertad 98",
  },
  {
    id: "5",
    firstName: "Pedro",
    lastName: "Sánchez",
    email: "pedro.s@example.com",
    phone: "555-5678",
    address: "Calle Norte 321",
  },
  {
    id: "6",
    firstName: "Ana",
    lastName: "Fernández",
    email: "ana.f@example.com",
    phone: "555-6789",
    address: "Av. Sur 654",
  },
  {
    id: "7",
    firstName: "Luis",
    lastName: "Torres",
    email: "luis.torres@example.com",
    phone: "555-7890",
    address: "Calle Quito 111",
  },
  {
    id: "8",
    firstName: "Sofía",
    lastName: "Ruiz",
    email: "sofia.r@example.com",
    phone: "555-8901",
    address: "Av. Amazonas 202",
  },
  {
    id: "9",
    firstName: "Diego",
    lastName: "Castro",
    email: "diego.c@example.com",
    phone: "555-9012",
    address: "Calle Loja 303",
  },
  {
    id: "10",
    firstName: "Valeria",
    lastName: "Navarro",
    email: "valeria.n@example.com",
    phone: "555-0123",
    address: "Av. Esmeraldas 404",
  }
];

export function ClientModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [clients, setClients] = useState(mockClients);

  // Usa el tipo Field explícitamente
  const clientFields: Field[] = [
    {
      name: "firstName",
      label: "Nombre",
      type: "text",
      required: true
    },
    {
      name: "lastName",
      label: "Apellido",
      type: "text",
      required: true
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "tel",
      required: true
    },
    {
      name: "address",
      label: "Dirección",
      type: "text",
      required: true
    },
  ];

  const handleCreate = () => {
    setCurrentClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: any) => {
    setCurrentClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
    setIsModalOpen(false);
  };

  const handleSubmit = (data: any) => {
    if (currentClient) {
      setClients(clients.map(client =>
        client.id === currentClient.id ? { ...client, ...data } : client
      ));
    } else {
      const newClient = { id: String(clients.length + 1), ...data };
      setClients([...clients, newClient]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="px-4 pt-1 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-lg font-semibold text-gray-800 -mt-2">Gestión de Clientes</h2>
        <PrimaryButton icon={Plus} onClick={handleCreate}>
          Nuevo Cliente
        </PrimaryButton>
      </div>

      <DataTable
        fields={[
          { name: 'firstName', label: 'Nombre' },
          { name: 'lastName', label: 'Apellido' },
          { name: 'email', label: 'Email' },
          { name: 'phone', label: 'Teléfono' },
          { name: 'address', label: 'Dirección' }
        ]}
        initialData={clients}
        onEdit={handleEdit}
        onDelete={(id) => handleDelete(id)}
        className="mt-1"
      />

      <CrudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentClient ? "Editar Cliente" : "Nuevo Cliente"}
        fields={clientFields}
        initialData={currentClient || {}}
        onSubmit={handleSubmit}
        onDelete={currentClient ? () => handleDelete(currentClient.id) : undefined}
        isEditing={!!currentClient}
      />
    </div>
  );
}