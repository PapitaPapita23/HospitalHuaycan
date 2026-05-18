import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ClinicalLayout from '../layouts/ClinicalLayout'
import ProtectedRoute from '../../modules/auth/ProtectedRoute'
import DashboardPage from '../../modules/dashboard/pages/DashboardPage'
import PatientsPage from '../../modules/patients/pages/PatientsPage'
import RecordsPage from '../../modules/records/pages/RecordsPage'
import AuditPage from '../../modules/audit/pages/AuditPage'
import { permissions } from '../../shared/security/permissions'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ClinicalLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute permission={permissions.VER_PANEL}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'pacientes',
        element: (
          <ProtectedRoute permission={permissions.VER_PACIENTES}>
            <PatientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'historias',
        element: (
          <ProtectedRoute permission={permissions.VER_HISTORIAS}>
            <RecordsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'auditoria',
        element: (
          <ProtectedRoute permission={permissions.VER_AUDITORIA}>
            <AuditPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter
