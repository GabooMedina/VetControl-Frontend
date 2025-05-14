import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './cn';

interface PrimaryButtonProps {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryButton({ 
  children, 
  icon: Icon,
  variant = "default",
  size = "md",
  onClick,
  className = '',
  disabled = false,
  type = "button",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        // Estilos base
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[#00B2B2] disabled:pointer-events-none disabled:opacity-50 shadow-sm",
        
        // Variantes
        variant === "default" && "bg-[#00B2B2] text-white hover:bg-[#009999]",
        variant === "outline" && "border border-gray-300 bg-transparent text-gray-800 hover:bg-gray-50",
        variant === "ghost" && "bg-transparent hover:bg-gray-100 text-gray-800",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",

        // Tamaños
        size === "sm" && "h-8 px-3 text-xs",
        size === "md" && "h-10 px-4 py-2 text-sm",
        size === "lg" && "h-12 px-6 text-base",

        // Espaciado si hay ícono
        Icon ? "gap-2" : "gap-1",

        // Clase adicional si se proporciona
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon className={cn(
          size === "sm" && "h-3 w-3",
          size === "md" && "h-4 w-4",
          size === "lg" && "h-5 w-5"
        )} />
      )}
      {children}
    </button>
  );
}
