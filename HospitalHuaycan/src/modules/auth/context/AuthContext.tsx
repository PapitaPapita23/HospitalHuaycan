import React, { createContext, useMemo, useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

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

  // Restaurar sesión activa de Supabase al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const rol = session.user.user_metadata?.rol ?? null
        const nombreCompleto = session.user.user_metadata?.nombre_completo ?? session.user.email ?? ''
        localStorage.setItem('token', session.access_token)
        localStorage.setItem('rol', rol ?? '')
        localStorage.setItem('nombreCompleto', nombreCompleto)
        setIsAuthenticated(true)
        setUserRoleState(rol)
      }
    })

    // Escuchar cambios de sesión (login/logout desde otra pestaña)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const rol = session.user.user_metadata?.rol ?? null
        const nombreCompleto = session.user.user_metadata?.nombre_completo ?? session.user.email ?? ''
        localStorage.setItem('token', session.access_token)
        localStorage.setItem('rol', rol ?? '')
        localStorage.setItem('nombreCompleto', nombreCompleto)
        setIsAuthenticated(true)
        setUserRoleState(rol)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('rol')
        localStorage.removeItem('nombreCompleto')
        setIsAuthenticated(false)
        setUserRoleState(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Credenciales incompletas')
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw new Error(error.message)
    }

    const rol = data.user.user_metadata?.rol ?? null
    const nombreCompleto = data.user.user_metadata?.nombre_completo ?? data.user.email ?? ''

    localStorage.setItem('token', data.session.access_token)
    localStorage.setItem('rol', rol ?? '')
    localStorage.setItem('nombreCompleto', nombreCompleto)

    setIsAuthenticated(true)
    setUserRoleState(rol)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
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
