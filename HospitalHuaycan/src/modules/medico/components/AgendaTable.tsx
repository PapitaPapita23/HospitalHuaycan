import React from "react";
import { IoTimeOutline, IoRefreshOutline } from "react-icons/io5";
import { CitaMedico } from "../types";

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE:   "bg-amber-100 text-amber-700",
  EN_ATENCION: "bg-blue-100 text-blue-700",
  ATENDIDO:    "bg-emerald-100 text-emerald-700",
  CANCELADO:   "bg-slate-100 text-slate-500",
};

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE:   "Pendiente",
  EN_ATENCION: "En atención",
  ATENDIDO:    "Atendido",
  CANCELADO:   "Cancelado",
};

function formatHora(h: string) {
  // "HH:mm:ss" → "HH:mm"
  return h?.slice(0, 5) ?? "—";
}

interface Props {
  agenda: CitaMedico[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelect: (cita: CitaMedico) => void;
}

const AgendaTable: React.FC<Props> = ({ agenda, isLoading, onRefresh, onSelect }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-3" />
        Cargando agenda…
      </div>
    );
  }

  if (agenda.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
        <IoTimeOutline className="w-10 h-10" />
        <p className="text-sm font-medium">No hay citas programadas para hoy.</p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 text-xs font-bold text-[#CA0000] hover:underline"
        >
          <IoRefreshOutline className="w-4 h-4" /> Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Hora</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Paciente</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">DNI</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado</th>
            <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Historial</th>
          </tr>
        </thead>
        <tbody>
          {agenda.map((cita) => (
            <tr key={cita.citaId} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4 font-mono font-semibold text-[#0A1733]">{formatHora(cita.horaInicio)}</td>
              <td className="py-3 px-4 font-semibold text-[#0A1733]">{cita.pacienteNombres}</td>
              <td className="py-3 px-4 text-slate-500">{cita.pacienteDni}</td>
              <td className="py-3 px-4">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${ESTADO_STYLE[cita.estadoConsulta] ?? "bg-slate-100 text-slate-500"}`}>
                  {ESTADO_LABEL[cita.estadoConsulta] ?? cita.estadoConsulta}
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onSelect(cita)}
                  className="text-xs font-bold text-[#CA0000] hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={!cita.historialConsultas?.length}
                >
                  Ver historial ({cita.historialConsultas?.length ?? 0})
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgendaTable;
