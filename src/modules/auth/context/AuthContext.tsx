import { createContext, useMemo, useState } from 'react'

type UserRole = 'teacher' | 'student' | null

type AuthContextType = {
  isAuthenticated: boolean
  userRole: UserRole
  handleLogin: (email: string, password: string) => Promise<void>
  handleLogout: () => void
  setUserRole: (role: Exclude<UserRole, null>) => void
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  userRole: null,
  handleLogin: async () => {},
  handleLogout: () => {},
  setUserRole: () => {},
}

export const AuthContext = createContext<AuthContextType>(defaultAuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRoleState] = useState<UserRole>(null)

  const handleLogin = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Credenciales incompletas')
    }
    await new Promise((resolve) => setTimeout(resolve, 700))
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
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
