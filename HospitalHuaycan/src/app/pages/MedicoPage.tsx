import React from "react";
import {
  IoPulseOutline, IoRefreshOutline, IoAlertCircleOutline,
  IoCheckmarkCircleOutline, IoTimeOutline, IoEllipseOutline,
} from "react-icons/io5";
import { useAgendaMedico } from "../../modules/medico/hooks/useAgendaMedico";
import AgendaTable from "../../modules/medico/components/AgendaTable";
import HistorialModal from "../../modules/medico/components/HistorialModal";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent }) => (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-black text-[#0A1733]">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  </div>
);

const MedicoPage: React.FC = () => {
  const { agenda, isLoading, error, selected, setSelected, load, pendientes, atendidos, enAtencion } =
    useAgendaMedico();

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

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
                     text-slate-600 text-sm font-semibold rounded-xl transition-colors disabled:opacity-40"
        >
          <IoRefreshOutline className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total del día"
          value={agenda.length}
          icon={<IoTimeOutline className="w-5 h-5 text-[#0A1733]" />}
          accent="bg-slate-100"
        />
        <StatCard
          label="En atención"
          value={enAtencion}
          icon={<IoEllipseOutline className="w-5 h-5 text-blue-600" />}
          accent="bg-blue-50"
        />
        <StatCard
          label="Pendientes"
          value={pendientes}
          icon={<IoTimeOutline className="w-5 h-5 text-amber-600" />}
          accent="bg-amber-50"
        />
        <StatCard
          label="Atendidos"
          value={atendidos}
          icon={<IoCheckmarkCircleOutline className="w-5 h-5 text-emerald-600" />}
          accent="bg-emerald-50"
        />
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
        <div className="px-6 py-4 border-b border-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Citas programadas</p>
        </div>
        <AgendaTable
          agenda={agenda}
          isLoading={isLoading}
          onRefresh={load}
          onSelect={(cita) => setSelected(cita)}
        />
      </div>

      {/* ── Historial modal ── */}
      {selected && <HistorialModal cita={selected} onClose={() => setSelected(null)} />}

    </div>
  );
};

export default MedicoPage;
