import { 
  IoHomeOutline, 
  IoCalendarOutline, 
  IoSettingsOutline, 
  IoPeopleOutline,
  IoPulseOutline,
  IoHeartHalfOutline,
  IoFolderOpenOutline
} from 'react-icons/io5'
import { FiUsers, FiLifeBuoy } from 'react-icons/fi'

export const navItems = [
  { to: '/home', icon: IoHomeOutline, label: 'Inicio' },
  
  // Módulos específicos de roles (se filtrarán dinámicamente)
  { to: '/admision', icon: IoPeopleOutline, label: 'Admisión' },
  { to: '/medico', icon: IoPulseOutline, label: 'Médico' },
  { to: '/triaje', icon: IoHeartHalfOutline, label: 'Triaje' },
  { to: '/archivo', icon: IoFolderOpenOutline, label: 'Archivo' },
  
  { to: '/calendar', icon: IoCalendarOutline, label: 'Agenda' },
  { to: '/profile', icon: FiUsers, label: 'Perfil' },
  { to: '/settings', icon: IoSettingsOutline, label: 'Configuración' },
  { to: '/support', icon: FiLifeBuoy, label: 'Soporte' },
]
