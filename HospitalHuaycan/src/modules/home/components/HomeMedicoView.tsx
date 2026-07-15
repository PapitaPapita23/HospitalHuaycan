import { IoPulseOutline } from "react-icons/io5";
import { useAgendaMedico } from "../../medico/hooks/useAgendaMedico";
import { ConteoItem } from "../types";
import HomeShell from "./HomeShell";
import RoleShortcutButton from "./RoleShortcutButton";
import MedicoInicioResumen from "./MedicoInicioResumen";
import MedicoEstadoChart from "./MedicoEstadoChart";

const ETAPAS = ["PENDIENTE", "EN_CONSULTA", "ATENDIDO"];

export default function HomeMedicoView() {
  const { agenda, isLoading, error, load, pendientes, atendidos } = useAgendaMedico();

  const citasPorEstado: ConteoItem[] = ETAPAS.map((etiqueta) => ({
    etiqueta,
    total: agenda.filter((c) => c.estadoConsulta === etiqueta).length,
  }));

  return (
    <HomeShell
      headerAction={<RoleShortcutButton to="/medico" label="Mi consultorio" icon={IoPulseOutline} />}
      isLoading={isLoading}
      error={error}
      onRetry={load}
    >
      <div className="space-y-4">
        <MedicoInicioResumen total={agenda.length} pendientes={pendientes} atendidos={atendidos} />
        <MedicoEstadoChart data={citasPorEstado} />
      </div>
    </HomeShell>
  );
}
