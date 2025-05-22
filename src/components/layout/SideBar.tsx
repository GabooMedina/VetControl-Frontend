import { Link } from 'react-router-dom'
import { 
  User, 
  PawPrint, 
  ClipboardList, 
  Search,
  Calendar,
  FileText,
  Package,
  Receipt,
  BarChart3
} from 'lucide-react'

interface SidebarProps {
  activeModule: string
  activeItem: string
  onItemChange: (item: string) => void
}

export function Sidebar({ activeModule, activeItem, onItemChange }: SidebarProps) {
  const getSidebarConfig = () => {
    switch(activeModule) {
      case 'consulta':
        return {
          title: 'Registro',
          items: [
            { name: 'clientes', label: 'Clientes', icon: <User className="mr-3 h-5 w-5" /> },
            { name: 'mascotas', label: 'Mascotas', icon: <PawPrint className="mr-3 h-5 w-5" /> },
            { name: 'historial', label: 'Historial', icon: <ClipboardList className="mr-3 h-5 w-5" /> },
            { name: 'buscar', label: 'Buscar', icon: <Search className="mr-3 h-5 w-5" /> }
          ]
        }
      case 'agenda':
        return {
          title: 'Citas',
          items: [
            { name: 'calendario', label: 'Calendario', icon: <Calendar className="mr-3 h-5 w-5" /> },
            { name: 'citas', label: 'Gestión', icon: <FileText className="mr-3 h-5 w-5" /> }
          ]
        }
      case 'productos':
        return {
          title: 'Inventario',
          items: [
            { name: 'inventario', label: 'Inventario', icon: <Package className="mr-3 h-5 w-5" /> },
            { name: 'medicamentos', label: 'Medicamentos', icon: <ClipboardList className="mr-3 h-5 w-5" /> }
          ]
        }
      case 'facturacion':
        return {
          title: 'Facturación',
          items: [
            { name: 'facturas', label: 'Facturas', icon: <Receipt className="mr-3 h-5 w-5" /> },
            { name: 'pagos', label: 'Pagos', icon: <FileText className="mr-3 h-5 w-5" /> }
          ]
        }
      case 'informes':
        return {
          title: 'Reportes',
          items: [
            { name: 'estadisticas', label: 'Estadísticas', icon: <BarChart3 className="mr-3 h-5 w-5" /> },
            { name: 'reportes', label: 'Reportes', icon: <FileText className="mr-3 h-5 w-5" /> }
          ]
        }
      default:
        return {
          title: 'Registro',
          items: []
        }
    }
  }

  const { title, items } = getSidebarConfig()

  return (
    <aside className="w-full md:w-64 bg-[#005456] text-white p-6 flex-shrink-0">
      <h3 className="text-2xl font-bold mb-6 pb-2">{title}</h3>
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
          key={item.name}
          to={`/dashboard/${activeModule}/${item.name}`}
          className={`
            flex items-center px-4 py-3 rounded-lg text-lg font-medium
            ${activeItem === item.name 
              ? 'bg-[#003e40] font-semibold' 
              : 'hover:bg-[#008888]'
            }
            transition-colors duration-200
          `}
          onClick={() => onItemChange(item.name)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Link>
        ))}
      </nav>
    </aside>
  )
}