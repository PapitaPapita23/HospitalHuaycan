import React, { useState, useEffect } from "react";
import { AppointmentItem } from "./types";
import GenerarCitaFlujo from "./GenerarCitaFlujo";
import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import ActionsPanel from "./components/ActionsPanel";
import AppointmentsTable from "./components/AppointmentsTable";
import { fetchCitasHoy } from "./services/admisionService";
import { IoAlertCircleOutline, IoRefreshOutline } from "react-icons/io5";

const AdmisionDashboard: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<"dashboard" | "agendar">("dashboard");
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCitasHoy();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la base de datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeFlow === "dashboard") {
      loadAppointments();
    }
  }, [activeFlow]);

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

      {isLoading ? (
        <div className="flex items-center justify-center h-44 text-slate-450">
          <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-3" />
          Cargando citas de la base de datos…
        </div>
      ) : error ? (
        <div className="flex flex-col gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-[#CA0000]">
            <IoAlertCircleOutline className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button
            onClick={loadAppointments}
            className="flex items-center gap-1.5 self-start text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 border rounded-xl"
          >
            <IoRefreshOutline className="w-4 h-4" /> Reintentar
          </button>
        </div>
      ) : (
        <>
          <StatsGrid appointments={appointments} />
          <ActionsPanel onAgendar={() => setActiveFlow("agendar")} />
          <AppointmentsTable appointments={appointments} />
        </>
      )}
    </div>
  );
};

export default AdmisionDashboard;
