import React from 'react';
import { Pencil } from 'lucide-react';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-300 px-4 py-2 text-sm font-medium min-w-[90px]"
  >
    <Pencil className="h-4 w-4" />
    Editar
  </button>
);

export default EditButton;
