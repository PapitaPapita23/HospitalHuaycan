import { IoNotificationsOutline, IoSettingsOutline, IoPersonOutline, IoLogOutOutline } from 'react-icons/io5'
import { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from '../../../modules/auth/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ministerioLogo from '../../../modules/auth/assets/ministerio-salud.png'

export default function Header() {
  const { handleLogout } = useContext(AuthContext)
  const nombreCompleto = localStorage.getItem('nombreCompleto') || 'Usuario'
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 z-20 h-[88px] w-full bg-[#ECF4FC] px-4 sm:px-6 print:hidden">
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

          {/* Configuración con dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(prev => !prev)}
              className={`rounded-xl p-1.5 bg-white transition-colors duration-200 ${settingsOpen ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
            >
              <IoSettingsOutline className="h-5 w-5" />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-lg border border-slate-100 py-1 z-50">
                <button
                  type="button"
                  onClick={() => { setSettingsOpen(false); navigate('/profile') }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                >
                  <IoPersonOutline className="h-4 w-4" />
                  Perfil
                </button>
                <hr className="my-1 border-slate-100" />
                <button
                  type="button"
                  onClick={() => { setSettingsOpen(false); handleLogout() }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <IoLogOutOutline className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}



