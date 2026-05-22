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
    <div className="min-h-screen bg-[#ECF4FC] print:bg-white print:min-h-0">
      <Header />
      <Navbar />
      <main className="px-2 pb-4 pt-[84px] sm:pl-[64px] sm:pr-3 sm:pt-[90px] ml-4 print:p-0 print:m-0 print:pt-0 print:w-full">
        <div className="min-h-[calc(100vh-106px)] rounded-[20px] print:min-h-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
