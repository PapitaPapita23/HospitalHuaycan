import { IoHeartHalfOutline } from "react-icons/io5";
import { DashboardResumenDTO } from "../types";

interface TriajeInicioResumenProps {
  resumen: DashboardResumenDTO;
}

export default function TriajeInicioResumen({ resumen }: TriajeInicioResumenProps) {
  const pendientes = resumen.citasPorEstadoHoy.find((e) => e.etiqueta === "PENDIENTE")?.total ?? 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0A1733] p-6">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/[0.04]" />
      <div className="absolute bottom-8 right-8 h-16 w-16 rounded-full bg-[#CA0000]/20" />
      <div className="relative z-10 mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <IoHeartHalfOutline className="h-5 w-5 text-white" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">Triajes pendientes · hoy</p>
      </div>
      <p className="relative z-10 mb-4 text-[3.5rem] font-black leading-none text-white">{pendientes}</p>
      <p className="relative z-10 text-xs font-semibold text-white/50">
        de {resumen.totalCitasHoy} citas programadas hoy
      </p>
    </div>
  );
}
