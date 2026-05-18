import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

function ProtectedRoute({ permission, children }) {
  const { can } = useAuth()

  if (!can(permission)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
