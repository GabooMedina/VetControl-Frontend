import { ReactNode } from 'react';

export type FieldType = "text" | "email" | "password" | "number" | "date" | "select" | "textarea" | "tel";

// Para formularios (CrudModal)
export interface Field {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: any;
}

// Para tablas (DataTable)
export interface TableField {
  name: string;
  label: string;
  render?: (value: any) => ReactNode;
  format?: (value: any) => string;
}

// Para acciones en DataTable
export interface TableAction {
  icon: ReactNode;
  onClick: (item: any) => void;
  tooltip: string;
}

// Props para CrudModal
export interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

// Props para DataTable
export interface DataTableProps {
  fields: TableField[];
  initialData: Record<string, any>[];
  className?: string;
  onEdit?: (item: any) => void;
  onDelete?: (id: any) => void;
  actions?: TableAction[];
}