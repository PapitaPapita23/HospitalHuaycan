import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../modules/auth/context/AuthContext'
import Header from './components/Header'
import Navbar from './components/Navbar'

export default function PlatformLayout() {
  const { isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#ECF4FC]">
      <Header />
      <Navbar />
      <main className="px-2 pb-4 pt-[84px] sm:pl-[64px] sm:pr-3 sm:pt-[90px] ml-4">
        <div className="min-h-[calc(100vh-106px)] rounded-[20px] bg-white p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
