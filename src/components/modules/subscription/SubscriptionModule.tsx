import React from 'react';

const SubscriptionModule: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Gestión de Suscripción</h1>
      <p className="mb-6 text-gray-600">
        Aquí podrás gestionar la suscripción de tu clínica veterinaria. Próximamente podrás ver y modificar tu plan, métodos de pago y facturación.
      </p>
      {/* Aquí puedes agregar formularios, tablas o información relevante de la suscripción */}
      <div className="border rounded p-4 text-center text-gray-400">
        Módulo genérico de suscripción
      </div>
    </div>
  );
};

export default SubscriptionModule;
