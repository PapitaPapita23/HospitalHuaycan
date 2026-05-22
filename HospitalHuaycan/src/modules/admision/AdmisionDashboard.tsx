import React, { useState } from "react";
import GenerarCitaFlujo from "./GenerarCitaFlujo";
import {
  IoSunnyOutline,
  IoMoonOutline,
  IoPersonAddOutline,
} from "react-icons/io5";

interface AppointmentItem {
  id: string;
  paciente: string;
  dni: string;
  especialidad: string;
  medico: string;
  turno: "MANANA" | "TARDE";
  fecha: string;
  estado: "CONFIRMADA" | "ATENDIDA" | "CANCELADA";
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "HHC-5832",
    paciente: "Juan Pérez Santos",
    dni: "12345678",
    especialidad: "Medicina General",
    medico: "Dr. Alejandro Ríos",
    turno: "MANANA",
    fecha: new Date().toLocaleDateString("sv-SE"),
    estado: "CONFIRMADA"
  },
  {
    id: "HHC-9214",
    paciente: "María Rodríguez Ruiz",
    dni: "87654321",
    especialidad: "Pediatría",
    medico: "Dra. Sofía Valdivia",
    turno: "MANANA",
    fecha: new Date().toLocaleDateString("sv-SE"),
    estado: "ATENDIDA"
  },
  {
    id: "HHC-3951",
    paciente: "Carlos Mendoza Vargas",
    dni: "99999999",
    especialidad: "Cardiología",
    medico: "Dr. Hugo Delgado",
    turno: "TARDE",
    fecha: new Date(Date.now() + 86400000).toLocaleDateString("sv-SE"),
    estado: "CONFIRMADA"
  }
];

const AdmisionDashboard: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<"dashboard" | "agendar">("dashboard");
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);

  if (activeFlow === "agendar") {
    return (
      <div className="space-y-4">
        {/* Encabezado del flujo */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-[#0A1733]">Registrar Cita Médica</h2>
            <p className="text-sm text-slate-500">Siga los pasos para identificar al paciente y programar su horario.</p>
          </div>
          <button
            onClick={() => setActiveFlow("dashboard")}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-all cursor-pointer"
          >
            Volver al Dashboard
          </button>
        </div>

        {/* Flujo de Citas */}
        <GenerarCitaFlujo onBackToDashboard={() => setActiveFlow("dashboard")} />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── HEADER ── */}
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
          onClick={() => setActiveFlow("agendar")}
          className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 bg-[#CA0000] hover:bg-[#a80000] active:scale-95 text-white text-sm font-bold rounded-xl transition-all duration-150 shadow-sm"
        >
          <span className="text-base leading-none">+</span>
          Nueva Cita
        </button>
      </div>

      {/* ── BENTO STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {/* Hero card — ocupa 2 cols en todos los tamaños */}
        <div className="col-span-2 bg-[#0A1733] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          {/* Decoración */}
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/[0.04]" />
          <div className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-[#CA0000]/25" />

          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 z-10">
            Total citas · hoy
          </p>
          <div className="z-10">
            <p className="text-[3.5rem] font-black text-white leading-none">24</p>
            {/* Barra mañana / tarde */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-white/40 font-semibold mb-1.5">
                <span>Mañana · 14</span>
                <span>Tarde · 10</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/50 rounded-full transition-all" style={{ width: "58%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Turno Mañana */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoSunnyOutline className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">14</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Mañana</p>
          </div>
        </div>

        {/* Turno Tarde */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between min-h-[140px]">
          <IoMoonOutline className="w-5 h-5 text-indigo-300" />
          <div>
            <p className="text-[2.4rem] font-black text-[#0A1733] leading-none">10</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">Turno Tarde</p>
          </div>
        </div>

      </div>

      {/* ── ACCIONES + NUEVOS PACIENTES ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

        {/* Lista de acciones numeradas */}
        <div className="md:col-span-2 bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Acciones rápidas
            </p>
          </div>
          <div>
            {[
              { n: "01", label: "Agendar Cita Médica",       sub: "Registrar nueva cita para un paciente",          action: () => setActiveFlow("agendar"), active: true },
              { n: "02", label: "Consultar Paciente por DNI", sub: "Búsqueda en padrón electoral y padrón hospital", action: undefined, active: false },
              { n: "03", label: "Reportes del Día",           sub: "Agendas, médicos saturados y turnos libres",     action: undefined, active: false },
            ].map(({ n, label, sub, action, active }) => (
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

        {/* Nuevos Pacientes */}
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

      {/* ── TABLA DE CITAS ── */}
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
                  {/* Ticket */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {apt.id}
                    </span>
                  </td>

                  {/* Paciente con avatar de iniciales */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#ECF4FC] flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-[#0A1733]">
                          {apt.paciente.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0A1733] text-sm leading-tight truncate">
                          {apt.paciente}
                        </p>
                        <p className="text-[10px] text-slate-400">{apt.dni}</p>
                      </div>
                    </div>
                  </td>

                  {/* Especialidad */}
                  <td className="px-6 py-4 text-slate-500 text-sm hidden md:table-cell">
                    {apt.especialidad}
                  </td>

                  {/* Médico */}
                  <td className="px-6 py-4 text-slate-500 text-sm hidden lg:table-cell">
                    {apt.medico}
                  </td>

                  {/* Turno */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md ${
                      apt.turno === "MANANA"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-[#0A1733]/8 text-[#0A1733]"
                    }`}>
                      {apt.turno === "MANANA" ? "Mañana" : "Tarde"}
                    </span>
                  </td>

                  {/* Estado */}
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

    </div>
  );
};

export default AdmisionDashboard;
