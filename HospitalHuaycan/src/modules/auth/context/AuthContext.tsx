import React, { createContext, useMemo, useState, useEffect } from 'react'
import { apiPost } from '../../../lib/apiClient'

export type UserRole = string | null

export type AuthContextType = {
  isAuthenticated: boolean
  userRole: UserRole
  handleLogin: (username: string, password: string) => Promise<void>
  handleLogout: () => void
  setUserRole: (role: Exclude<UserRole, null>) => void
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  userRole: null,
  handleLogin: async () => { },
  handleLogout: () => { },
  setUserRole: () => { },
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRoleState] = useState<UserRole>(null)

  // Restaurar sesión desde localStorage al cargar
  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    if (token && rol) {
      setIsAuthenticated(true)
      setUserRoleState(rol)
    }
  }, [])

  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      throw new Error('Credenciales incompletas')
    }

    const data = await apiPost<{
      token: string
      userId: number
      username: string
      nombreCompleto: string
      rol: string
    }>('/auth/login', { username, password })

    localStorage.setItem('token', data.token)
    localStorage.setItem('userId', String(data.userId))
    localStorage.setItem('rol', data.rol)
    localStorage.setItem('nombreCompleto', data.nombreCompleto)

    setIsAuthenticated(true)
    setUserRoleState(data.rol)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('rol')
    localStorage.removeItem('nombreCompleto')
    setIsAuthenticated(false)
    setUserRoleState(null)
  }

  const setUserRole = (role: Exclude<UserRole, null>) => {
    setUserRoleState(role)
  }

  const value = useMemo(
    () => ({ isAuthenticated, userRole, handleLogin, handleLogout, setUserRole }),
    [isAuthenticated, userRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
