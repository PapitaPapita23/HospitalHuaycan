import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../../modules/auth/context/AuthContext'
import { navItems } from './navItems'

export default function Navbar() {
  const location = useLocation()
  const { userRole } = useContext(AuthContext)

  const filteredNavItems = navItems.filter((item) => {
    if (item.to === '/admision' && userRole !== 'ROLE_ADMISION') return false
    if (item.to === '/medico' && userRole !== 'ROLE_MEDICO') return false
    if (item.to === '/triaje' && userRole !== 'ROLE_ENFERMERIA') return false
    if (item.to === '/archivo' && userRole !== 'ROLE_ARCHIVO') return false
    return true
  })

  return (
    <nav className="fixed z-10 hidden h-[80%] flex-col items-center justify-center bg-transparent sm:flex xl-custom:py-12">
      <div className="relative h-8 w-full rounded-tr-[100%] bg-[#CA0000]">
        <div
          className="h-8 bg-[#ECF4FC]"
          style={{ borderRadius: '0% 50% 30% 60% / 0% 100% 0% 90%' }}
        ></div>
      </div>

      <div className="hidden w-16 space-y-8 rounded-br-[33px] rounded-tr-[33px] bg-[#CA0000] px-2 py-2 sm:flex sm:px-2 lg:px-2">
        <div className="flex h-auto w-full flex-col items-center justify-between py-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <div className="group relative sm:flex sm:flex-col" key={item.to}>
                <Link to={item.to}>
                  <div
                    className={`my-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 group-hover:bg-white/20 ${
                      location.pathname === item.to ? 'bg-white/25' : ''
                    }`}
                  >
                    <Icon className="h-6 w-6 text-[#FFFFFF]" />
                  </div>
                </Link>
                <div className="absolute left-full top-1/2 z-[9999] ml-[17px] hidden -translate-y-1/2 transform rounded-lg bg-[#CA0000] px-3 py-1 text-sm text-white group-hover:block">
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative h-8 w-full rounded-br-[100%] bg-[#CA0000]">
        <div
          className="h-8 bg-[#ECF4FC]"
          style={{ borderRadius: '60% 30% 50% 0% / 90% 0% 100% 0%' }}
        ></div>
      </div>
    </nav>
  )
}
