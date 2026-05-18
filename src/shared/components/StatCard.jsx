function StatCard({ title, value, helper }) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 shadow-lg shadow-cyan-950/20">
      <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-cyan-300">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{helper}</p>
    </article>
  )
}

export default StatCard
