import React from "react";

interface StepIndicatorProps {
  step: 1 | 2;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
        step >= 1 ? "bg-[#CA0000] text-white" : "bg-slate-100 text-slate-400"
      }`}>
        {step > 1 ? "✓" : "1"}
      </div>
      <span className={`text-xs font-bold ${step >= 1 ? "text-[#0A1733]" : "text-slate-400"}`}>
        Paciente
      </span>
    </div>
    <div className={`flex-1 h-px transition-colors ${step > 1 ? "bg-[#CA0000]" : "bg-slate-200"}`} />
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all ${
        step === 2 ? "bg-[#CA0000] text-white" : "bg-slate-100 text-slate-400"
      }`}>
        2
      </div>
      <span className={`text-xs font-bold ${step === 2 ? "text-[#0A1733]" : "text-slate-400"}`}>
        Cita Médica
      </span>
    </div>
  </div>
);

export default StepIndicator;
