import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { TopNav } from './TopNav'
import { Sidebar } from './SideBar'
import { useState, useEffect } from 'react'

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState('consulta')
  const [activeSubModule, setActiveSubModule] = useState('lista')
  const [pageTitle, setPageTitle] = useState('Gestión de Clientes')

  // Sincroniza el estado con la ruta actual
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean)
    
    if (pathParts.length >= 2 && pathParts[0] === 'dashboard') {
      const module = pathParts[1]
      const subModule = pathParts[2] || 'lista'
      
      setActiveModule(module)
      setActiveSubModule(subModule)
      updateTitle(module, subModule)
    }
  }, [location.pathname])

  const updateTitle = (module: string, subModule: string) => {
    switch (module) {
      case 'consulta':
        switch (subModule) {
          case 'clientes': setPageTitle('Gestión de Clientes'); break
          case 'mascotas': setPageTitle('Gestión de Mascotas'); break
          case 'historial': setPageTitle('Historiales Médicos'); break
          default: setPageTitle('Gestión de Clientes')
        }
        break
      case 'agenda':
        setPageTitle('Gestión de Agenda')
        break
      case 'productos':
        setPageTitle('Gestión de Productos')
        break
      case 'facturacion':
        setPageTitle('Facturación')
        break
      case 'informes':
        setPageTitle('Reportes')
        break
      default:
        setPageTitle('Dashboard')
    }
  }

  const handleModuleChange = (module: string) => {
    setActiveModule(module)
    // Navega a la ruta por defecto del módulo
    navigate(`/dashboard/${module}`)
    updateTitle(module, 'clientes')
  }

  const handleSubModuleChange = (subModule: string) => {
    setActiveSubModule(subModule)
    // Navega a la subruta específica
    navigate(`/dashboard/${activeModule}/${subModule}`)
    updateTitle(activeModule, subModule)
  }

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      <TopNav 
        onModuleChange={handleModuleChange} 
      />
      
      {/* Sección del título */}
      <div className="bg-[#1A2A4A] py-4 shadow-md">
        <h2 className="text-center text-3xl font-bold text-white tracking-wide">
          {pageTitle}
        </h2>
      </div>

      <div className="flex flex-1">
        <Sidebar 
          activeModule={activeModule}
          activeItem={activeSubModule}
          onItemChange={handleSubModuleChange}
        />
        
        <main className="flex-1 bg-white p-6 shadow-inner">
          <Outlet context={{ 
            activeModule, 
            activeSubModule,
            setPageTitle
          }} />
        </main>
      </div>
    </div>
  )
}