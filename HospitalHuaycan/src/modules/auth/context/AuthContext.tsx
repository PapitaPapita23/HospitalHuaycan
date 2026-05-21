import React, { createContext, useMemo, useState, useEffect } from 'react'

export type UserRole = string | null

export type AuthContextType = {
  isAuthenticated: boolean
  userRole: UserRole
  handleLogin: (email: string, password: string) => Promise<void>
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

  // Efecto para restaurar la sesión al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('rol')
    if (token && rol) {
      setIsAuthenticated(true)
      setUserRoleState(rol)
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Credenciales incompletas')
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Mapeamos email como username esperado por el backend
          password: password,
        }),
      })

      if (!response.ok) {
        // Leemos el mensaje de error retornado por el backend si existe
        const errorText = await response.text()
        throw new Error(errorText || 'Credenciales inválidas')
      }

      const data = await response.json()
      
      // Guardar información en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('rol', data.rol)
      localStorage.setItem('nombreCompleto', data.nombreCompleto)

      // Actualizar estados
      setIsAuthenticated(true)
      setUserRoleState(data.rol)
    } catch (error: any) {
      console.error('Error al intentar iniciar sesión:', error)
      throw error // Lanzamos para que LoginForm lo capture
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
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
