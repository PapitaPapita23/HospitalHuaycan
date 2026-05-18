import PageHeader from '../../../shared/components/PageHeader'

const timeline = [
  { date: '2026-05-16', event: 'Nota clinica firmada', owner: 'Dr. Paredes' },
  { date: '2026-05-15', event: 'Resultado de laboratorio incorporado', owner: 'Lab Central' },
  { date: '2026-05-14', event: 'Consentimiento informado digital', owner: 'Admision' },
]

function RecordsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Historias clinicas"
        subtitle="Vista longitudinal con eventos clinicos, adjuntos y versionado de documentos."
      />

      <ol className="space-y-3">
        {timeline.map((item) => (
          <li key={`${item.date}-${item.event}`} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{item.date}</p>
            <p className="mt-1 text-base font-semibold text-slate-100">{item.event}</p>
            <p className="mt-1 text-sm text-slate-300">Responsable: {item.owner}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default RecordsPage
