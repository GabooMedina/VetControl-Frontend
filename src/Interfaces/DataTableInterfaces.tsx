export interface ITableField {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
  }
  
  export interface IDataTableProps {
    fields: ITableField[];
    initialData: Record<string, any>[];
    emptyMessage?: string;
    className?: string;
    onSave?: (data: any) => void;
    onDelete?: (id: any) => void;
    onEdit?: (item: any) => void;
    onCreate?: () => void;
    showBackButton?: boolean;
    backButtonUrl?: string;
  }
  