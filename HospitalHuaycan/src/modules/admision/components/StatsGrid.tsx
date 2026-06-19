import React from "react";
import { IoSunnyOutline, IoMoonOutline } from "react-icons/io5";
import { AppointmentItem } from "../types";

interface StatsGridProps {
  appointments: AppointmentItem[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ appointments }) => {
  const total = appointments.length;
  const mañana = appointments.filter((a) => a.turno === "MANANA").length;
  const tarde = appointments.filter((a) => a.turno === "TARDE").length;
  const progreso = total > 0 ? Math.round((mañana / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      {/* Hero card */}
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
              <span>Mañana · {mañana}</span>
              <span>Tarde · {tarde}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/50 rounded-full transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Turno Mañana */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
        <IoSunnyOutline className="w-5 h-5 text-amber-400" />
        <div>
          <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{mañana}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Mañana</p>
        </div>
      </div>

      {/* Turno Tarde */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
        <IoMoonOutline className="w-5 h-5 text-indigo-300" />
        <div>
          <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">{tarde}</p>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Tarde</p>
        </div>
      </div>

    </div>
  );
};

export default StatsGrid;

