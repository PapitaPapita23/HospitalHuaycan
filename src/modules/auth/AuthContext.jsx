import { createContext, useContext, useMemo, useState } from 'react'
import { rolePermissions } from '../../shared/security/permissions'
import { roles } from '../../shared/security/roles'

const AuthContext = createContext(null)

const defaultSession = {
  id: 'u-001',
  name: 'Dra. Karen Huaman',
  role: roles.MEDICO,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultSession)

  const authValue = useMemo(() => {
    const permissions = rolePermissions[user.role] ?? []

    const can = (permission) => permissions.includes(permission)

    return {
      user,
      can,
      switchRole: (newRole) => {
        setUser((current) => ({ ...current, role: newRole }))
      },
    }
  }, [user])

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return context
}
