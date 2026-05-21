import { IoHomeOutline, IoCalendarOutline, IoSettingsOutline } from 'react-icons/io5'
import { FiUsers, FiLifeBuoy } from 'react-icons/fi'

export const navItems = [
  { to: '/home', icon: IoHomeOutline, label: 'Inicio' },
  { to: '/calendar', icon: IoCalendarOutline, label: 'Agenda' },
  { to: '/profile', icon: FiUsers, label: 'Perfil' },
  { to: '/settings', icon: IoSettingsOutline, label: 'Configuracion' },
  { to: '/support', icon: FiLifeBuoy, label: 'Soporte' },
]
