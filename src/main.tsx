import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout';
import SignIn from './auth/SignIn'
import { ClientModule } from './components/modules/records/ClientModule'
import { PetModule } from './components/modules/records/PetModule';
import { HistoryModule } from './components/modules/records/HistoryModule';
import './index.css'

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
          { path: 'mascotas', element: <PetModule/> },
          { path: 'historial', element: <HistoryModule/> },
        ]
      },
      {
        path: 'agenda',
        children: [
          { path: 'calendario', element: <div>PAGINA CALENDARIO</div> },
          { path: 'citas', element: <div>PAGINA CITAS</div> }
        ]
      },
      {
        path: 'productos',
        children: [
          { path: 'inventario', element: <div>PAGINA INVENTARIOS</div> },
          { path: 'medicamentos', element: <div>PAGINA MEDICAMENTOS</div> }
        ]
      },
      {
        path: 'facturacion',
        children: [
          { path: 'facturas', element: <div>PAGINA FACTURAS</div> },
          { path: 'pagos', element: <div>PAGINA PAGOS</div> }
        ]
      },
      {
        path: 'informes',
        children: [
          { path: 'estadisticas', element: <div>PAGINA ESTADISTICAS</div> },
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