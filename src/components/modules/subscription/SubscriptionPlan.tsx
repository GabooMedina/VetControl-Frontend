import React, { useState } from 'react';
import { CreditCard, CalendarDays, CheckCircle, Crown, RefreshCw, Headphones, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentMethodModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-6 text-gray-900">Actualizar Método de Pago</h2>
        {/* Método de pago actual */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-1">Método de pago actual</div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2">
            <CreditCard className="text-blue-500 w-5 h-5" />
            <span className="tracking-widest font-mono text-base">•••• 4532</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold">VISA</span>
            <span className="text-xs text-gray-500 ml-2">Vence 12/2025</span>
          </div>
        </div>
        {/* Formulario de tarjeta */}
        <form className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-gray-700 text-sm mb-1">Número de Tarjeta<span className="text-pink-500">*</span></label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <CreditCard className="text-gray-400 mr-2 w-5 h-5" />
              <input id="cardNumber" type="text" className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
          </div>
          <div>
            <label htmlFor="cardName" className="block text-gray-700 text-sm mb-1">Nombre en la Tarjeta<span className="text-pink-500">*</span></label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <User className="text-gray-400 mr-2 w-5 h-5" />
              <input id="cardName" type="text" className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" placeholder="Juan Pérez" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="cardExpiry" className="block text-gray-700 text-sm mb-1">Fecha de Expiración<span className="text-pink-500">*</span></label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <CalendarDays className="text-gray-400 mr-2 w-5 h-5" />
                <input id="cardExpiry" type="text" className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" placeholder="MM/YY" maxLength={5} />
              </div>
            </div>
            <div className="w-28">
              <label htmlFor="cardCVV" className="block text-gray-700 text-sm mb-1">CVV<span className="text-pink-500">*</span></label>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Lock className="text-gray-400 mr-2 w-5 h-5" />
                <input id="cardCVV" type="password" className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400" placeholder="123" maxLength={4} />
              </div>
            </div>
          </div>
        </form>
        <div className="flex items-center gap-2 mt-5 mb-6 text-gray-500 text-sm">
          <Lock className="w-4 h-4" />
          Tus datos de pago están seguros y encriptados
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 rounded bg-[#00bfc5] text-white font-semibold hover:bg-[#00a3a8]">Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlan: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Panel principal */}
      <div className="flex-1 bg-white rounded-2xl shadow p-8 min-w-[350px] border border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="text-[#00b386] w-6 h-6" />
          <span className="text-2xl font-bold text-gray-800">Plan Actual</span>
        </div>
        <div className="text-gray-500 text-sm mb-6">Detalles de tu suscripción activa</div>
        <hr className="mb-6" />
        <div className="flex flex-wrap items-center mb-6 gap-3">
          <span className="text-xl font-semibold text-[#00b386]">Plan Profesional</span>
          <span className="text-3xl font-bold text-[#00b386]">$49.99</span>
          <span className="text-gray-500">/mensual</span>
          <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Activo</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-6 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-[#00b386]" />
            <div>
              <div className="text-gray-500">Próximo pago</div>
              <div className="font-bold text-gray-800">14/1/2024</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[#00b386]" />
            <div>
              <div className="text-gray-500">Método de pago</div>
              <div className="font-bold text-gray-800">Tarjeta ****4532</div>
            </div>
          </div>
        </div>
        <hr className="mb-6" />
        <div className="mb-4">
          <div className="font-semibold text-gray-800 mb-2">Características incluidas:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ul className="list-none space-y-1">
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Hasta 500 pacientes</li>
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Backup automático</li>
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Soporte prioritario</li>
            </ul>
            <ul className="list-none space-y-1">
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Reportes detallados</li>
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Calendario avanzado</li>
              <li className="flex items-center"><CheckCircle className="text-[#00b386] mr-2 h-5 w-5" />Integración con laboratorios</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="flex items-center gap-2 bg-[#e6faf6] text-[#00b386] px-4 py-2 rounded font-medium hover:bg-[#00b386] hover:text-white transition border border-[#00b386]"
            onClick={() => setShowModal(true)}
          >
            <CreditCard className="h-5 w-5" />
            Actualizar Método de Pago
          </button>
          <button
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded font-medium border border-gray-300 hover:bg-gray-200 transition"
            onClick={() => navigate('/dashboard/suscripcion/cambiar')}
          >
            <RefreshCw className="h-5 w-5" />
            Cambiar Plan
          </button>
        </div>
      </div>
      {/* Panel lateral */}
      <div className="flex flex-col gap-6 w-full md:w-80">
        <div className="bg-white rounded-2xl shadow p-6 mb-2 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Uso Actual</h3>
          <div className="flex justify-between text-sm mb-1"><span>Pacientes</span><span>127 / 500</span></div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2">
            <div className="h-2 bg-[#00b386] rounded" style={{width: '25%'}}></div>
          </div>
          <div className="flex justify-between text-sm mb-1"><span>Almacenamiento</span><span>2.3 GB / 10 GB</span></div>
          <div className="w-full h-2 bg-gray-200 rounded mb-2">
            <div className="h-2 bg-[#00b386] rounded" style={{width: '23%'}}></div>
          </div>
          <div className="text-sm text-gray-600">Citas este mes <b>89</b></div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Soporte</h3>
          <p className="text-sm text-gray-600 mb-3">Como usuario del Plan Profesional, tienes acceso a soporte prioritario.</p>
          <button className="flex items-center justify-center gap-2 bg-[#00b386] text-white px-4 py-2 rounded font-medium w-full hover:bg-[#009e7a] transition">
            <Headphones className="h-5 w-5" />
            Contactar Soporte
          </button>
        </div>
      </div>
      <PaymentMethodModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default SubscriptionPlan;
