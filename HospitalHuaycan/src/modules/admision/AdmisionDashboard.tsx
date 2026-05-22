import React, { useState } from "react";
import GenerarCitaFlujo from "./GenerarCitaFlujo";
import { 
  IoCalendarOutline, 
  IoPeopleOutline, 
  IoTimeOutline, 
  IoAddCircleOutline, 
  IoSearchOutline, 
  IoDocumentTextOutline,
  IoPrintOutline,
  IoAlertCircleOutline
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
    <div className="space-y-8 animate-fadeIn">
      {/* Encabezado del Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0A1733]">Módulo de Admisión</h2>
          <p className="text-sm text-slate-500">Panel de administración para registrar y controlar el flujo de citas médicas.</p>
        </div>
        <button
          onClick={() => setActiveFlow("agendar")}
          className="flex items-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          <IoAddCircleOutline className="w-5.5 h-5.5" />
          Agendar Nueva Cita
        </button>
      </div>

      {/* Estadísticas de Hoy */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <IoCalendarOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Citas de Hoy</span>
            <span className="text-2xl font-bold text-slate-800">24</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <IoTimeOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Turno Mañana</span>
            <span className="text-2xl font-bold text-slate-800">14</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <IoTimeOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Turno Tarde</span>
            <span className="text-2xl font-bold text-slate-800">10</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <IoPeopleOutline className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Nuevos Pacientes</span>
            <span className="text-2xl font-bold text-slate-800">6</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Acciones Rápidas */}
      <div>
        <h3 className="text-lg font-bold text-[#0A1733] mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div 
            onClick={() => setActiveFlow("agendar")}
            className="group cursor-pointer bg-white border border-slate-100 hover:border-blue-500/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <IoAddCircleOutline className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1733] text-sm group-hover:text-blue-600 transition-colors">Agendar Cita</h4>
              <p className="text-xs text-slate-500 mt-1">Busque pacientes e ingrese citas de forma automatizada y rápida.</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white border border-slate-100 hover:border-blue-500/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-blue-600 text-slate-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <IoSearchOutline className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1733] text-sm group-hover:text-blue-600 transition-colors">Consultar Pacientes</h4>
              <p className="text-xs text-slate-500 mt-1">Búsqueda rápida en el padrón electoral y del hospital por DNI o apellidos.</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white border border-slate-100 hover:border-blue-500/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4">
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-blue-600 text-slate-500 group-hover:text-white rounded-lg flex items-center justify-center transition-colors">
              <IoDocumentTextOutline className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0A1733] text-sm group-hover:text-blue-600 transition-colors">Reportes de Admisión</h4>
              <p className="text-xs text-slate-500 mt-1">Reportes diarios de agendas, médicos saturados y turnos libres.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Citas del Día */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#0A1733]">Registro de Citas Recientes</h3>
          <span className="text-xs text-slate-400 font-semibold">Visualización de las últimas citas registradas</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Ticket</th>
                <th className="px-6 py-3.5">Paciente</th>
                <th className="px-6 py-3.5">Especialidad</th>
                <th className="px-6 py-3.5">Médico</th>
                <th className="px-6 py-3.5">Fecha / Turno</th>
                <th className="px-6 py-3.5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{apt.id}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 block">{apt.paciente}</span>
                    <span className="text-xs text-slate-400">DNI: {apt.dni}</span>
                  </td>
                  <td className="px-6 py-4">{apt.especialidad}</td>
                  <td className="px-6 py-4">{apt.medico}</td>
                  <td className="px-6 py-4">
                    <span className="block font-medium text-slate-700">
                      {new Date(apt.fecha + "T00:00:00").toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{apt.turno === "MANANA" ? "Mañana" : "Tarde"}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      apt.estado === "ATENDIDA" 
                        ? "bg-slate-100 text-slate-600" 
                        : apt.estado === "CANCELADA"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
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
