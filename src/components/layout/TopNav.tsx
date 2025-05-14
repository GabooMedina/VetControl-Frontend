import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/vetControl.svg";

interface TopNavProps {
  onModuleChange?: (module: string) => void;
}

export function TopNav({ onModuleChange }: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determina el módulo activo basado en la ruta
  const getActiveModule = () => {
    const path = location.pathname;
    if (path.includes('/consulta')) return 'consulta';
    if (path.includes('/agenda')) return 'agenda';
    if (path.includes('/productos') || path.includes('/inventario')) return 'productos';
    if (path.includes('/informes') || path.includes('/reportes')) return 'informes';
    if (path.includes('/facturacion')) return 'facturacion';
    return 'consulta';
  };

  const activeModule = getActiveModule();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/SignIn');
  };

  const modules = [
    { id: 'consulta', name: "Consulta", path: "/dashboard/consulta/clientes" },
    { id: 'agenda', name: "Agenda", path: "/dashboard/agenda/calendario" },
    { id: 'productos', name: "Productos", path: "/dashboard/productos/inventario" },
    { id: 'informes', name: "Informes", path: "/dashboard/informes/estadisticas" },
    { id: 'facturacion', name: "Facturación", path: "/dashboard/facturacion/facturas" }
  ];

  const handleNavigation = (moduleId: string, path: string) => {
    if (onModuleChange) {
      onModuleChange(moduleId);
    }
    navigate(path);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-auto mr-2" />
        </div>

        {/* Navegación */}
        <nav className="flex items-center space-x-6 mt-2 md:mt-0">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleNavigation(module.id, module.path)}
              className={`px-2 py-1 font-medium relative transition-colors ${
                activeModule === module.id 
                  ? "text-[#00B2B2] font-semibold border-b-2 border-[#00B2B2]"
                  : "text-gray-600 hover:text-[#00B2B2]"
              }`}
            >
              {module.name}
            </button>
          ))}
          
          {/* Botón de salir */}
          <button 
            onClick={handleLogout}
            className="px-2 py-1 text-gray-600 font-medium flex items-center hover:text-red-600 transition-colors"
          >
            Salir
            <LogOut className="ml-1 h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}