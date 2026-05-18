import PageHeader from '../../../shared/components/PageHeader'

const logs = [
  {
    actor: 'u-045 / enfermeria',
    action: 'Lectura de historia HC-0001',
    when: '17-05-2026 08:21',
    risk: 'Bajo',
  },
  {
    actor: 'u-077 / medico',
    action: 'Firma de nota evolutiva HC-0002',
    when: '17-05-2026 08:34',
    risk: 'Bajo',
  },
  {
    actor: 'u-013 / admin',
    action: 'Acceso break-glass HC-0041',
    when: '17-05-2026 02:13',
    risk: 'Alto',
  },
]

function AuditPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Auditoria y seguridad"
        subtitle="Trazabilidad inmutable de accesos, cambios y acciones de alto impacto."
      />

      <div className="space-y-3">
        {logs.map((log) => (
          <article key={`${log.actor}-${log.when}`} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-300">{log.when}</p>
            <p className="mt-1 font-semibold text-slate-100">{log.action}</p>
            <p className="mt-1 text-sm text-slate-300">Actor: {log.actor}</p>
            <p className="mt-1 text-sm text-cyan-300">Riesgo: {log.risk}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AuditPage
