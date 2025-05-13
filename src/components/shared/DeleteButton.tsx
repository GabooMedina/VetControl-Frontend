import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onConfirm: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onConfirm }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 px-4 py-2 text-sm font-medium min-w-[90px]"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </button>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ¿Confirmar eliminación?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;