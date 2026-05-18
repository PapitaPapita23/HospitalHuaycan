import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import Login from '../../modules/auth/pages/Login'
import RecoverPassword from '../../modules/auth/pages/RecoverPassword'

const baseLinkClass =
  'rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-clave" element={<RecoverPassword />} />
      <Route
        path="/home"
        element={
          <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
            <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
              <header className="space-y-4">
                <h1 className="text-3xl font-bold md:text-5xl">Hospital Huaycan</h1>
                <p className="max-w-2xl text-slate-300">
                  Rutas configuradas con React Router. Usa esta base para crecimiento por
                  modulos.
                </p>
                <nav className="flex flex-wrap gap-2">
                  <NavLink
                    to="/home"
                    end
                    className={({ isActive }) =>
                      isActive
                        ? `${baseLinkClass} bg-cyan-500/20 text-cyan-200`
                        : baseLinkClass
                    }
                  >
                    Inicio
                  </NavLink>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? `${baseLinkClass} bg-cyan-500/20 text-cyan-200`
                        : baseLinkClass
                    }
                  >
                    Ir a login
                  </NavLink>
                </nav>
              </header>

              <HomePage />
            </section>
          </main>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
