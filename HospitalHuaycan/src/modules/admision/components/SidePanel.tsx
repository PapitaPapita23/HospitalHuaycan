import React from "react";

interface SidePanelProps {
  step: 1 | 2;
}

const SidePanel: React.FC<SidePanelProps> = ({ step }) => (
  <div className="hidden lg:flex flex-col gap-4">

    {/* Guía del flujo */}
    <div className="bg-[#0A1733] rounded-2xl p-5 text-white">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Cómo funciona</p>
      <div className="space-y-4">
        <div className={`flex gap-3 transition-opacity ${step === 1 ? "opacity-100" : "opacity-40"}`}>
          <div className="w-6 h-6 rounded-full bg-[#CA0000] flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">1</div>
          <div>
            <p className="text-xs font-black leading-tight">Identificar Paciente</p>
            <p className="text-[11px] text-white/50 mt-0.5">Busque por DNI. Si no existe, regístrelo rápidamente.</p>
          </div>
        </div>
        <div className={`flex gap-3 transition-opacity ${step === 2 ? "opacity-100" : "opacity-40"}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${step === 2 ? "bg-[#CA0000]" : "bg-white/10"}`}>2</div>
          <div>
            <p className="text-xs font-black leading-tight">Detalles de la Cita</p>
            <p className="text-[11px] text-white/50 mt-0.5">Asigne especialidad, médico, fecha y turno.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Turnos */}
    <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Turnos disponibles</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0A1733]">Mañana</span>
          <span className="text-[11px] text-slate-400">07:00 – 13:00</span>
        </div>
        <div className="w-full h-px bg-slate-100" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0A1733]">Tarde</span>
          <span className="text-[11px] text-slate-400">13:00 – 19:00</span>
        </div>
      </div>
    </div>

    {/* Nota */}
    <div className="p-4 border-l-2 border-[#CA0000] bg-white rounded-r-xl">
      <p className="text-[11px] text-slate-500 leading-relaxed">
        El ticket se genera automáticamente al guardar. Entréguelo al paciente para su atención.
      </p>
    </div>

  </div>
);

export default SidePanel;
