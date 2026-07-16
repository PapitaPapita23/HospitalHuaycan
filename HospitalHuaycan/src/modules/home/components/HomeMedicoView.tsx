import { IoPulseOutline } from "react-icons/io5";
import { useAgendaMedico } from "../../medico/hooks/useAgendaMedico";
import { useDashboardResumen } from "../hooks/useDashboardResumen";
import { ConteoItem } from "../types";
import HomeShell from "./HomeShell";
import RoleShortcutButton from "./RoleShortcutButton";
import MedicoInicioResumen from "./MedicoInicioResumen";
import MedicoEstadoChart from "./MedicoEstadoChart";
import MedicoHorasChart from "./MedicoHorasChart";
import DistribucionDonut from "./DistribucionDonut";
import TendenciaChart from "./TendenciaChart";

const ETAPAS = ["PENDIENTE", "EN_CONSULTA", "ATENDIDO"];

export default function HomeMedicoView() {
  const { agenda, isLoading, error, load, pendientes, atendidos } = useAgendaMedico();
  const { resumen } = useDashboardResumen();

  const citasPorEstado: ConteoItem[] = ETAPAS.map((etiqueta) => ({
    etiqueta,
    total: agenda.filter((c) => c.estadoConsulta === etiqueta).length,
  }));

  const porAtender = agenda.length - atendidos;
  const avancePct = agenda.length > 0 ? Math.round((atendidos / agenda.length) * 100) : 0;

  return (
    <HomeShell
      headerAction={<RoleShortcutButton to="/medico" label="Mi consultorio" icon={IoPulseOutline} />}
      isLoading={isLoading}
      error={error}
      onRetry={load}
    >
      <div className="space-y-4">
        <MedicoInicioResumen total={agenda.length} pendientes={pendientes} atendidos={atendidos} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DistribucionDonut
            title="Avance de mi agenda"
            subtitle="Hoy"
            data={[
              { label: "Atendidas", value: atendidos, color: "#1a8f66" },
              { label: "Por atender", value: porAtender, color: "#2a78d6" },
            ]}
            emptyMessage="No tienes citas registradas hoy"
            tooltipLabel="citas"
            centerValue={`${avancePct}%`}
            centerLabel="completado"
          />
          <MedicoEstadoChart data={citasPorEstado} />
          <MedicoHorasChart agenda={agenda} />
          {resumen && (
            <TendenciaChart
              data={resumen.citasUltimos7Dias}
              title="Citas en el hospital"
              subtitle="Últimos 7 días · todas las especialidades"
              color="#2a78d6"
              tooltipLabel="Citas"
              emptyMessage="Aún no hay citas en los últimos 7 días"
            />
          )}
        </div>
      </div>
    </HomeShell>
  );
}
