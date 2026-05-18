function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <p className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            React + Tailwind
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">Proyecto listo para construir</h1>
          <p className="max-w-2xl text-slate-300">
            Esta base ya tiene React con Vite y Tailwind configurado. Empieza editando
            <span className="mx-1 rounded bg-slate-800 px-2 py-1 text-cyan-300">src/App.jsx</span>
            y crea tus componentes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-300">UI moderna</h2>
            <p className="text-sm text-slate-300">Usa utilidades de Tailwind para estilos rapidos y consistentes.</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-300">Escalable</h2>
            <p className="text-sm text-slate-300">Organiza vistas y componentes por modulos segun tu dominio.</p>
          </article>
          <article className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <h2 className="mb-2 text-lg font-semibold text-cyan-300">Rapido</h2>
            <p className="text-sm text-slate-300">Vite aporta recarga instantanea para iterar sin friccion.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
