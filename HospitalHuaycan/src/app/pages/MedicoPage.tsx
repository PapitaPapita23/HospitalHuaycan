import React, { useState } from "react";
import {
  IoPulseOutline, IoRefreshOutline, IoAlertCircleOutline,
  IoCheckmarkCircleOutline, IoTimeOutline, IoEllipseOutline,
} from "react-icons/io5";
import { useAgendaMedico } from "../../modules/medico/hooks/useAgendaMedico";
import AgendaTable from "../../modules/medico/components/AgendaTable";
import HistorialModal from "../../modules/medico/components/HistorialModal";
import ConsultorioMedico from "../../modules/medico/components/ConsultorioMedico";
import HistorialTimeline from "../../modules/medico/components/HistorialTimeline";
import { CitaMedico } from "../../modules/medico/types";

const MedicoPage: React.FC = () => {
  const { agenda, isLoading, error, selected, setSelected, load, pendientes, atendidos, enAtencion } =
    useAgendaMedico();

  const [activeConsulta, setActiveConsulta] = useState<CitaMedico | null>(null);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const total      = agenda.length;
  const progreso   = total > 0 ? Math.round((atendidos / total) * 100) : 0;

  // Render workflow for active consultation
  if (activeConsulta) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <button
            onClick={() => setActiveConsulta(null)}
            className="text-xs font-bold text-[#0A1733] hover:text-[#CA0000] flex items-center gap-1.5 transition-colors"
          >
            ← Volver a la Bandeja
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-500">Consulta en Progreso</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lado izquierdo: Formulario de consulta médica */}
          <div className="lg:col-span-2">
            <ConsultorioMedico
              cita={activeConsulta}
              onSuccess={() => {
                load();
                setActiveConsulta(null);
              }}
              onCancel={() => setActiveConsulta(null)}
            />
          </div>

          {/* Lado derecho: Historial del paciente */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm self-start">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-4 text-[#0A1733]">
              <div className="p-2 bg-[#CA0000]/10 rounded-lg">
                <IoPulseOutline className="w-4 h-4 text-[#CA0000]" />
              </div>
              <div>
                <h3 className="text-sm font-black">Historial Clínico</h3>
                <p className="text-[10px] font-semibold text-slate-400">Antecedentes y Atenciones Previas</p>
              </div>
            </div>
            <div className="max-h-[720px] overflow-y-auto pr-1">
              {activeConsulta.historiaClinicaId ? (
                <HistorialTimeline historiaClinicaId={activeConsulta.historiaClinicaId} />
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Sin historia clínica asociada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#CA0000]/10 rounded-xl">
            <IoPulseOutline className="w-6 h-6 text-[#CA0000]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0A1733]">Bandeja del Día</h2>
            <p className="text-xs font-semibold text-[#CA0000] capitalize">{today}</p>
          </div>
        </div>
        <button
          onClick={load}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50
                     text-slate-650 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          <IoRefreshOutline className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {/* Hero card navy */}
        <div className="col-span-2 bg-[#0A1733] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.04]" />
          <div className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-[#CA0000]/25" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 z-10">
            Total citas · hoy
          </p>
          <div className="z-10">
            <p className="text-[3.5rem] font-black text-white leading-none">{total}</p>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-white/40 font-semibold mb-1.5">
                <span>Atendidos · {atendidos}</span>
                <span>{progreso}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/50 rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* En atención */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoEllipseOutline className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{enAtencion}</p>
            <p className="text-[11px] text-slate-450 font-semibold mt-1">En atención</p>
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoTimeOutline className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{pendientes}</p>
            <p className="text-[11px] text-slate-455 font-semibold mt-1">Pendientes</p>
          </div>
        </div>

      </div>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <IoAlertCircleOutline className="w-5 h-5 text-[#CA0000] shrink-0" />
          <p className="text-sm font-medium text-[#CA0000]">{error}</p>
        </div>
      )}

      {/* ── Agenda table ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Citas programadas</p>
          </div>
          {atendidos > 0 && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <IoCheckmarkCircleOutline className="w-3.5 h-3.5" />
              {atendidos} atendido{atendidos > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <AgendaTable
          agenda={agenda}
          isLoading={isLoading}
          onRefresh={load}
          onSelect={(cita) => setSelected(cita)}
          onStartConsulta={(cita) => setActiveConsulta(cita)}
        />
      </div>

      {/* ── Historial modal ── */}
      {selected && <HistorialModal cita={selected} onClose={() => setSelected(null)} />}

    </div>
  );
};

export default MedicoPage;

