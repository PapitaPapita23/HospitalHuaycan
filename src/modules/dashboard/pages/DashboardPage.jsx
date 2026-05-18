import PageHeader from '../../../shared/components/PageHeader'
import StatCard from '../../../shared/components/StatCard'

function DashboardPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Centro de control clinico"
        subtitle="Monitorea atenciones, conversion de historias y alertas operativas en tiempo real."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Historias digitalizadas hoy" value="128" helper="+14% frente a ayer" />
        <StatCard title="Pendientes de validacion" value="23" helper="Requieren revision documental" />
        <StatCard title="Consultas activas" value="42" helper="17 en teleconsulta" />
        <StatCard title="Alertas de seguridad" value="3" helper="2 acceso fuera de horario" />
      </div>
    </section>
  )
}

export default DashboardPage
