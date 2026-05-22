import React from "react";
import { IoTimeOutline, IoRefreshOutline, IoDocumentTextOutline } from "react-icons/io5";
import { CitaMedico } from "../types";

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE:   "bg-amber-50 text-amber-700 border border-amber-200",
  EN_ATENCION: "bg-blue-50 text-blue-700 border border-blue-200",
  ATENDIDO:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  CANCELADO:   "bg-slate-100 text-slate-500 border border-slate-200",
};

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE:   "Pendiente",
  EN_ATENCION: "En atención",
  ATENDIDO:    "Atendido",
  CANCELADO:   "Cancelado",
};

function formatHora(h: string) {
  return h?.slice(0, 5) ?? "—";
}

function getInitials(nombre: string) {
  return nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
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
      <div className="flex items-center justify-center h-44 text-slate-400">
        <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-3" />
        Cargando agenda…
      </div>
    );
  }

  if (agenda.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-44 gap-3 text-slate-400">
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
    <div className="divide-y divide-slate-50">
      {agenda.map((cita, idx) => (
        <div
          key={cita.citaId}
          className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group"
        >
          {/* Número de orden */}
          <span className="text-[11px] font-black text-slate-300 w-5 shrink-0 text-right">
            {String(idx + 1).padStart(2, "0")}
          </span>

          {/* Hora */}
          <div className="w-16 shrink-0">
            <p className="text-base font-black text-[#0A1733] font-mono leading-none">
              {formatHora(cita.horaInicio)}
            </p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">hrs</p>
          </div>

          {/* Avatar + nombre */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#0A1733] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-black text-white">
                {getInitials(cita.pacienteNombres)}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0A1733] truncate">{cita.pacienteNombres}</p>
              <p className="text-[11px] text-slate-400 font-medium">DNI {cita.pacienteDni}</p>
            </div>
          </div>

          {/* Estado */}
          <span
            className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0
              ${ESTADO_STYLE[cita.estadoConsulta] ?? "bg-slate-100 text-slate-500 border border-slate-200"}`}
          >
            {ESTADO_LABEL[cita.estadoConsulta] ?? cita.estadoConsulta}
          </span>

          {/* Botón historial */}
          <button
            onClick={() => onSelect(cita)}
            disabled={!cita.historialConsultas?.length}
            className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors shrink-0
              enabled:border-[#CA0000]/30 enabled:text-[#CA0000] enabled:hover:bg-[#CA0000]/5
              disabled:border-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            <IoDocumentTextOutline className="w-3.5 h-3.5" />
            Historial
            {(cita.historialConsultas?.length ?? 0) > 0 && (
              <span className="bg-[#CA0000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cita.historialConsultas.length}
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AgendaTable;
