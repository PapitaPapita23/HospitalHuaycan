import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../modules/auth/AuthContext'
import { roles } from '../../shared/security/roles'

const links = [
  { to: '/', label: 'Panel' },
  { to: '/pacientes', label: 'Pacientes' },
  { to: '/historias', label: 'Historias' },
  { to: '/auditoria', label: 'Auditoria' },
]

function ClinicalLayout() {
  const { user, switchRole } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/90">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300">Hospital Huaycan</p>
            <p className="text-lg font-semibold">Plataforma de Historias Clinicas Digitales</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-sm">
              <p className="text-slate-200">{user.name}</p>
              <p className="text-slate-400">Rol activo: {user.role}</p>
            </div>
            <select
              value={user.role}
              onChange={(event) => switchRole(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring"
            >
              {Object.values(roles).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <nav className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm transition ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <main className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ClinicalLayout
