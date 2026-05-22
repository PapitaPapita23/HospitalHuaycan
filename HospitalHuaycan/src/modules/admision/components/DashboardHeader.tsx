import React from "react";

interface DashboardHeaderProps {
  onNuevaCita: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNuevaCita }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
        {new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
        Admisión
      </h2>
    </div>
    <button
      onClick={onNuevaCita}
      className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 bg-[#CA0000] hover:bg-[#a80000] active:scale-95 text-white text-sm font-bold rounded-xl transition-all duration-150 shadow-sm"
    >
      <span className="text-base leading-none">+</span>
      Nueva Cita
    </button>
  </div>
);

export default DashboardHeader;
