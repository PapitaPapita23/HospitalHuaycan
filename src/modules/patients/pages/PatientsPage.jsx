import PageHeader from '../../../shared/components/PageHeader'

const patients = [
  { id: 'HC-0001', name: 'Rosa Quispe', age: 42, status: 'Seguimiento' },
  { id: 'HC-0002', name: 'Luis Huaman', age: 58, status: 'Post operatorio' },
  { id: 'HC-0003', name: 'Mariana Prado', age: 31, status: 'Control prenatal' },
]

function PatientsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Pacientes"
        subtitle="Gestion de identidad y acceso rapido a fichas clinicas longitudinales."
      />

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <table className="min-w-full divide-y divide-slate-700 bg-slate-900/60">
          <thead className="bg-slate-800/80 text-left text-xs uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-4 py-3">Historia</th>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Edad</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm text-slate-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-800/60">
                <td className="px-4 py-3 font-medium text-cyan-300">{patient.id}</td>
                <td className="px-4 py-3">{patient.name}</td>
                <td className="px-4 py-3">{patient.age}</td>
                <td className="px-4 py-3">{patient.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default PatientsPage
