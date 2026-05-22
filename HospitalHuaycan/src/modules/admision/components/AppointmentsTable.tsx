import React from "react";
import { AppointmentItem } from "../types";

interface AppointmentsTableProps {
  appointments: AppointmentItem[];
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ appointments }) => (
  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
          Registro de citas
        </p>
        <h3 className="text-base font-black text-[#0A1733] leading-tight">Recientes</h3>
      </div>
      <span className="text-[11px] font-bold text-slate-300 bg-slate-100 px-2.5 py-1 rounded-lg">
        {appointments.length} entradas
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
            <th className="px-6 py-3 text-left font-black">Ticket</th>
            <th className="px-6 py-3 text-left font-black">Paciente</th>
            <th className="px-6 py-3 text-left font-black hidden md:table-cell">Especialidad</th>
            <th className="px-6 py-3 text-left font-black hidden lg:table-cell">Médico</th>
            <th className="px-6 py-3 text-left font-black">Turno</th>
            <th className="px-6 py-3 text-left font-black">Estado</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt) => (
            <tr
              key={apt.id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {apt.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ECF4FC] flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-black text-[#0A1733]">
                      {apt.paciente.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0A1733] text-sm leading-tight truncate">{apt.paciente}</p>
                    <p className="text-[10px] text-slate-400">{apt.dni}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-500 text-sm hidden md:table-cell">{apt.especialidad}</td>
              <td className="px-6 py-4 text-slate-500 text-sm hidden lg:table-cell">{apt.medico}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md ${
                  apt.turno === "MANANA" ? "bg-amber-50 text-amber-600" : "bg-[#0A1733]/8 text-[#0A1733]"
                }`}>
                  {apt.turno === "MANANA" ? "Mañana" : "Tarde"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md ${
                  apt.estado === "ATENDIDA"
                    ? "bg-slate-100 text-slate-400"
                    : apt.estado === "CANCELADA"
                    ? "bg-[#CA0000]/10 text-[#CA0000]"
                    : "bg-[#0A1733]/8 text-[#0A1733]"
                }`}>
                  {apt.estado === "ATENDIDA" ? "Atendido" : apt.estado === "CANCELADA" ? "Cancelado" : "Confirmada"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AppointmentsTable;
