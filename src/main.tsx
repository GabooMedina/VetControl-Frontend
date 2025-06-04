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
import { CategoriesModule } from './components/modules/products/CategoriesModule';
import { InventoryModule } from './components/modules/products/InventoryModule';
import { LotsModule } from './components/modules/products/LotsModule';
import { SubCategoriesModule } from './components/modules/products/SubCategoriesModule';
import { SuppliersModule } from './components/modules/products/SuppliersModule';
import ReportsModule from './components/modules/reports/ReportsModule';
import CalendarModule from './components/modules/schedule/CalendarModule';
import { ToastProvider } from './components/shared/Toast';
import SignUp from './auth/SignUp';
import Dashboard from './components/modules/reports/DashboardModule';
import SubscriptionModule from './components/modules/subscription/SubscriptionModule';
import SubscriptionPlan from './components/modules/subscription/SubscriptionPlan';
import SubscriptionChange from './components/modules/subscription/SubscriptionChange';
import SubscriptionHistory from './components/modules/subscription/SubscriptionHistory';

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
    path: '/register',
    element: <SignUp />
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
          { path: 'calendario', element: <CalendarModule /> },
          { path: 'citas', element: <AppointmentModule /> }
        ]
      },
      {
        path: 'productos',
        children: [
          { path: 'categorias', element: <CategoriesModule /> },
          { path: 'subcategorias', element: <SubCategoriesModule /> },
          { path: 'inventario', element: <InventoryModule /> },
          { path: 'proveedores', element: <SuppliersModule /> },
          { path: 'lotes', element: <LotsModule /> },
        ]
      },
      {
        path: 'facturacion',
        children: [
          { path: '', element: <Navigate to="facturas" replace /> },
          { path: 'facturas', element: <BillingModule /> },
          { path: 'pagos', element: <div>PAGINA PAGOS</div> }
        ]
      },
      {
        path: 'informes',
        children: [
          { path: 'estadisticas', element: <Dashboard /> },
          { path: 'reportes', element: <ReportsModule /> }
        ]
      },
      {
        path: 'suscripcion',
        children: [
          { path: 'plan', element: <SubscriptionPlan /> },
          { path: 'cambiar', element: <SubscriptionChange /> },
          { path: 'historial', element: <SubscriptionHistory /> },
          { path: '', element: <SubscriptionPlan /> }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider />
    <RouterProvider router={router} />
  </StrictMode>
)