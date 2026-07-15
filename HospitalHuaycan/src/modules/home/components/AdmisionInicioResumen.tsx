import { DashboardResumenDTO } from "../types";
import CitasHoyHeroCard from "./CitasHoyHeroCard";

interface AdmisionInicioResumenProps {
  resumen: DashboardResumenDTO;
}

export default function AdmisionInicioResumen({ resumen }: AdmisionInicioResumenProps) {
  const mañana = resumen.citasPorTurnoHoy.find((t) => t.etiqueta === "MANANA")?.total ?? 0;
  const tarde = resumen.citasPorTurnoHoy.find((t) => t.etiqueta === "TARDE")?.total ?? 0;

  return (
    <CitasHoyHeroCard total={resumen.totalCitasHoy} mañana={mañana} tarde={tarde} fechaLabel="hoy" />
  );
}
