import { IoSunnyOutline, IoMoonOutline, IoPeopleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { DashboardResumenDTO } from "../types";
import CitasHoyHeroCard from "./CitasHoyHeroCard";

interface DashboardStatsProps {
  resumen: DashboardResumenDTO;
  fechaLabel: string;
}

export default function DashboardStats({ resumen, fechaLabel }: DashboardStatsProps) {
  const mañana = resumen.citasPorTurnoHoy.find((t) => t.etiqueta === "MANANA")?.total ?? 0;
  const tarde = resumen.citasPorTurnoHoy.find((t) => t.etiqueta === "TARDE")?.total ?? 0;
  const total = resumen.totalCitasHoy;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="col-span-2">
          <CitasHoyHeroCard total={total} mañana={mañana} tarde={tarde} fechaLabel={fechaLabel} />
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoSunnyOutline className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{mañana}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Mañana</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoMoonOutline className="w-5 h-5 text-indigo-300" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{tarde}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Tarde</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ECF4FC] flex items-center justify-center shrink-0">
            <IoPeopleOutline className="w-5 h-5 text-[#0A1733]" />
          </div>
          <div>
            <p className="text-[1.7rem] font-black text-[#0A1733] leading-none">{resumen.totalPacientesActivos}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Pacientes activos</p>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#ECF4FC] flex items-center justify-center shrink-0">
            <IoDocumentTextOutline className="w-5 h-5 text-[#0A1733]" />
          </div>
          <div>
            <p className="text-[1.7rem] font-black text-[#0A1733] leading-none">{resumen.totalDocumentosEscaneados}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Documentos escaneados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
