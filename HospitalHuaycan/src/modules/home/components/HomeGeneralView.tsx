import { IoHeartHalfOutline, IoPeopleOutline, IoFolderOpenOutline } from "react-icons/io5";
import { useDashboardResumen } from "../hooks/useDashboardResumen";
import { todayISODate, parseISODate } from "../dateUtils";
import HomeShell from "./HomeShell";
import CalendarPopover from "./CalendarPopover";
import RoleShortcutButton from "./RoleShortcutButton";
import DashboardStats from "./DashboardStats";
import EspecialidadBarChart from "./EspecialidadBarChart";
import EstadoCitasChart from "./EstadoCitasChart";
import TendenciaChart from "./TendenciaChart";
import EstadoConsultaChart from "./EstadoConsultaChart";
import TriajeInicioResumen from "./TriajeInicioResumen";
import AdmisionInicioResumen from "./AdmisionInicioResumen";
import ArchivoInicioResumen from "./ArchivoInicioResumen";

interface HomeGeneralViewProps {
  userRole: string | null;
}

export default function HomeGeneralView({ userRole }: HomeGeneralViewProps) {
  const { resumen, isLoading, error, load, fecha, setFecha } = useDashboardResumen();

  const fechaLabel =
    resumen && resumen.fecha !== todayISODate()
      ? parseISODate(resumen.fecha).toLocaleDateString("es-PE", { day: "numeric", month: "long" })
      : "hoy";

  let headerAction;
  let content = null;

  if (userRole === "ROLE_ENFERMERIA") {
    headerAction = <RoleShortcutButton to="/triaje" label="Ir a Triaje" icon={IoHeartHalfOutline} />;
    content = resumen && (
      <div className="space-y-4">
        <TriajeInicioResumen resumen={resumen} />
        <EstadoConsultaChart data={resumen.atencionesPorEstadoConsultaHoy} fechaLabel="hoy" />
      </div>
    );
  } else if (userRole === "ROLE_ADMISION") {
    headerAction = <RoleShortcutButton to="/admision" label="Ir a Admisión" icon={IoPeopleOutline} />;
    content = resumen && (
      <div className="space-y-4">
        <AdmisionInicioResumen resumen={resumen} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EspecialidadBarChart data={resumen.topEspecialidadesHoy} fechaLabel="hoy" />
          <EstadoCitasChart data={resumen.citasPorEstadoHoy} fechaLabel="hoy" />
        </div>
      </div>
    );
  } else if (userRole === "ROLE_ARCHIVO") {
    headerAction = <RoleShortcutButton to="/archivo" label="Ir a Archivo" icon={IoFolderOpenOutline} />;
    content = resumen && (
      <div className="space-y-4">
        <ArchivoInicioResumen resumen={resumen} />
        <TendenciaChart
          data={resumen.documentosUltimos7Dias}
          title="Documentos digitalizados"
          subtitle="Últimos 7 días"
          color="#1baf7a"
          tooltipLabel="Documentos"
          emptyMessage="Aún no hay documentos escaneados en los últimos 7 días"
        />
      </div>
    );
  } else {
    headerAction = <CalendarPopover selectedDate={fecha} onSelectDate={setFecha} />;
    content = resumen && (
      <>
        <DashboardStats resumen={resumen} fechaLabel={fechaLabel} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EspecialidadBarChart data={resumen.topEspecialidadesHoy} fechaLabel={fechaLabel} />
          <EstadoCitasChart data={resumen.citasPorEstadoHoy} fechaLabel={fechaLabel} />
          <TendenciaChart
            data={resumen.citasUltimos7Dias}
            title="Tendencia de citas"
            subtitle="Últimos 7 días"
            color="#1baf7a"
            tooltipLabel="Citas"
            emptyMessage="Aún no hay citas en los últimos 7 días"
          />
          <EstadoConsultaChart data={resumen.atencionesPorEstadoConsultaHoy} fechaLabel={fechaLabel} />
        </div>
      </>
    );
  }

  return (
    <HomeShell headerAction={headerAction} isLoading={isLoading} error={error} onRetry={load}>
      {content}
    </HomeShell>
  );
}
