import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout';
import SignIn from './auth/SignIn'
import { ClientModule } from './components/modules/records/ClientModule'
import { PetModule } from './components/modules/records/PetModule';
import { HistoryModule } from './components/modules/records/HistoryModule';
import { BillingModule } from './components/modules/billing/BillingModule';
import { AppointmentModule } from './components/modules/schedule/Appointment';
import './index.css'
import MedicationsModule from './components/modules/products/Medications';
import InventoryModule from './components/modules/products/Inventory';
import ReportsModule from './components/modules/reports/Reports';
//import InventoryPage from './components/modules/products/inventory';
import CalendarModule from './components/modules/schedule/CalendarModule';




const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signin" replace />
  },
  {
    path: '/signin',
    element: <SignIn />
  },
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Navigate to="consulta/clientes" replace />
      },
      {
        path: 'consulta',
        children: [
          { path: 'clientes', element: <ClientModule /> },
          { path: 'mascotas', element: <PetModule /> },
          { path: 'historial', element: <HistoryModule /> },
        ]
      },
      {
        path: 'agenda',
        children: [
          { path: 'calendario', element: <CalendarModule/> },
          { path: 'citas', element: <AppointmentModule/> }
        ]
      },
      {
        path: 'productos',
        children: [
          { path: 'inventario', element: <InventoryModule/> },
          { path: 'medicamentos', element: <MedicationsModule/> }
        ]
      },
      {
        path: 'facturacion',
        children: [
          { path: 'facturas', element: <BillingModule/>},
          { path: 'pagos', element: <div>PAGINA PAGOS</div> }
        ]
      },
      {
        path: 'informes',
        children: [
          { path: 'estadisticas', element: <ReportsModule/> },
          { path: 'reportes', element: <div>PAGINA REPORTES</div> }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)