import { IoNotificationsOutline, IoSettingsOutline, IoPersonOutline } from 'react-icons/io5'
import ministerioLogo from '../../../modules/auth/assets/ministerio-salud.png'

export default function Header() {
  return (
    <header className="fixed top-0 z-20 h-[88px] w-full bg-[#ECF4FC] px-4 sm:px-6">
      <div className="flex h-full items-center justify-between">
        <img
          src={ministerioLogo}
          alt="Ministerio de Salud"
          className="h-10 w-auto"
        />
        <div className="flex items-center gap-3 text-[#0A1733]">
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoNotificationsOutline className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoSettingsOutline className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-xl p-1.5 hover:bg-slate-200 bg-white">
            <IoPersonOutline className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
