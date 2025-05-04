import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export function PrimaryButton({ 
  children, 
  icon: Icon,
  onClick,
  className = ''
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-[#00B2B2] hover:bg-[#009999] 
        text-white px-4 py-2 rounded-md 
        flex items-center 
        transition-colors duration-200 
        shadow-md text-sm
        ${className}
      `}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}