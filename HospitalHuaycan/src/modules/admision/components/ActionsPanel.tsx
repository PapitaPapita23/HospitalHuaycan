import React from "react";
import { IoPersonAddOutline } from "react-icons/io5";

interface ActionItem {
  n: string;
  label: string;
  sub: string;
  action?: () => void;
  active: boolean;
}

interface ActionsPanelProps {
  onAgendar: () => void;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({ onAgendar }) => {
  const actions: ActionItem[] = [
    { n: "01", label: "Agendar Cita Médica",        sub: "Registrar nueva cita para un paciente",          action: onAgendar, active: true },
    { n: "02", label: "Consultar Paciente por DNI",  sub: "Búsqueda en padrón electoral y padrón hospital", action: undefined,  active: false },
    { n: "03", label: "Reportes del Día",            sub: "Agendas, médicos saturados y turnos libres",     action: undefined,  active: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

      {/* Lista de acciones */}
      <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Acciones rápidas
          </p>
        </div>
        <div>
          {actions.map(({ n, label, sub, action, active }) => (
            <button
              key={n}
              onClick={action}
              className={`w-full group flex items-center gap-4 px-6 py-4 border-t border-slate-100 transition-colors text-left
                ${active ? "hover:bg-[#ECF4FC]" : "hover:bg-slate-50/60 opacity-60"}`}
            >
              <span className={`text-[11px] font-black tabular-nums w-6 shrink-0 ${active ? "text-[#CA0000]" : "text-slate-300"}`}>
                {n}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold leading-tight ${active ? "text-[#0A1733]" : "text-slate-500"}`}>{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">{sub}</p>
              </div>
              <span className={`text-xl shrink-0 transition-transform duration-150 ${active ? "group-hover:translate-x-0.5 text-[#CA0000]" : "text-slate-200"}`}>
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nuevos pacientes */}
      <div className="bg-[#CA0000] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden min-h-[180px]">
        <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute right-8 top-6 w-8 h-8 rounded-full bg-white/10" />
        <IoPersonAddOutline className="w-6 h-6 text-white/60 z-10" />
        <div className="z-10">
          <p className="text-[3.5rem] font-black text-white leading-none">6</p>
          <p className="text-white/70 text-[11px] font-semibold mt-1 uppercase tracking-wide">
            Nuevos pacientes hoy
          </p>
        </div>
      </div>

    </div>
  );
};

export default ActionsPanel;
