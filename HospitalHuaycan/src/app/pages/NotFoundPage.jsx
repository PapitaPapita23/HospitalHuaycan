import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6">
      <h2 className="text-2xl font-semibold text-rose-300">404 - Ruta no encontrada</h2>
      <p className="mt-3 text-slate-200">La URL que intentas abrir no existe.</p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-lg border border-rose-400/50 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
