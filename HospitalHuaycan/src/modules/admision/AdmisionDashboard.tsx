import React, { useState } from "react";
import { AppointmentItem } from "./types";
import GenerarCitaFlujo from "./GenerarCitaFlujo";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import ActionsPanel from "./components/ActionsPanel";
import AppointmentsTable from "./components/AppointmentsTable";

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "HHC-5832",
    paciente: "Juan Pérez Santos",
    dni: "12345678",
    especialidad: "Medicina General",
    medico: "Dr. Alejandro Ríos",
    turno: "MANANA",
    fecha: new Date().toLocaleDateString("sv-SE"),
    estado: "CONFIRMADA",
  },
  {
    id: "HHC-9214",
    paciente: "María Rodríguez Ruiz",
    dni: "87654321",
    especialidad: "Pediatría",
    medico: "Dra. Sofía Valdivia",
    turno: "MANANA",
    fecha: new Date().toLocaleDateString("sv-SE"),
    estado: "ATENDIDA",
  },
  {
    id: "HHC-3951",
    paciente: "Carlos Mendoza Vargas",
    dni: "99999999",
    especialidad: "Cardiología",
    medico: "Dr. Hugo Delgado",
    turno: "TARDE",
    fecha: new Date(Date.now() + 86400000).toLocaleDateString("sv-SE"),
    estado: "CONFIRMADA",
  },
];

const AdmisionDashboard: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<"dashboard" | "agendar">("dashboard");
  const [appointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);

  if (activeFlow === "agendar") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between print:hidden">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
              Admisión · Registro
            </p>
            <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
              Nueva Cita
            </h2>
          </div>
          <button
            onClick={() => setActiveFlow("dashboard")}
            className="self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 bg-[#CA0000] hover:bg-[#a80000] text-white text-sm font-bold rounded-xl transition-all duration-150 active:scale-95"
          >
            ← Volver al panel
          </button>
        </div>
        <GenerarCitaFlujo onBackToDashboard={() => setActiveFlow("dashboard")} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardHeader onNuevaCita={() => setActiveFlow("agendar")} />
      <StatsGrid />
      <ActionsPanel onAgendar={() => setActiveFlow("agendar")} />
      <AppointmentsTable appointments={appointments} />
    </div>
  );
};

export default AdmisionDashboard;
