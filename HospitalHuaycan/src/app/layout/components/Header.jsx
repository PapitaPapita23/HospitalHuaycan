import { IoNotificationsOutline, IoSettingsOutline, IoPersonOutline, IoLogOutOutline } from 'react-icons/io5'
import { useContext } from 'react'
import { AuthContext } from '../../../modules/auth/context/AuthContext'
import ministerioLogo from '../../../modules/auth/assets/ministerio-salud.png'

export default function Header() {
  const { handleLogout } = useContext(AuthContext)
  const nombreCompleto = localStorage.getItem('nombreCompleto') || 'Usuario'

  return (
    <header className="fixed top-0 z-20 h-[88px] w-full bg-[#ECF4FC] px-4 sm:px-6">
      <div className="flex h-full items-center justify-between">
        <img
          src={ministerioLogo}
          alt="Ministerio de Salud"
          className="h-10 w-auto"
        />
        <div className="flex items-center gap-3 text-[#0A1733]">
          <span className="hidden md:inline-block text-xs font-semibold text-slate-500 mr-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
            {nombreCompleto}
          </span>
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoNotificationsOutline className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoSettingsOutline className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoPersonOutline className="h-5 w-5" />
          </button>
          <button 
            type="button" 
            onClick={handleLogout}
            title="Cerrar Sesión"
            className="rounded-xl p-1.5 hover:bg-red-50 hover:text-red-600 bg-white text-slate-600 transition-colors duration-200 cursor-pointer"
          >
            <IoLogOutOutline className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

