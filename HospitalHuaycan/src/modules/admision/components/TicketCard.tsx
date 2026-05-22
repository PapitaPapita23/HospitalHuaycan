import React from "react";
import { CitaResponseDTO } from "../types";

interface TicketCardProps {
  ticket: CitaResponseDTO;
  pacienteNombreCompleto: string;
  fechaRegistro: string;
}

const BARCODE_WIDTHS = [1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1];

const TicketCard: React.FC<TicketCardProps> = ({ ticket, pacienteNombreCompleto, fechaRegistro }) => (
  <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden print:shadow-none print:border-none print:max-w-full">

    {/* Encabezado del Hospital */}
    <div className="bg-[#0A1733] text-white p-5 text-center relative">
      <h3 className="font-bold text-lg tracking-wide uppercase">Hospital Huaycán</h3>
      <p className="text-xs text-slate-300">Comprobante de Cita Médica</p>
      <div className="absolute left-0 right-0 -bottom-3 flex justify-between px-4 print:hidden">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 bg-white rounded-full" />
        ))}
      </div>
    </div>

    {/* Cuerpo del Ticket */}
    <div className="p-6 pt-8 space-y-6">

      {/* Número de ticket y fecha de registro */}
      <div className="flex justify-between items-center text-xs text-slate-400 border-b border-dashed pb-3">
        <span>TICKET N°: <strong className="text-slate-800 font-semibold">{ticket.numero_ticket}</strong></span>
        <span>REGISTRO: <strong>{fechaRegistro}</strong></span>
      </div>

      {/* Datos de la cita */}
      <div className="space-y-4">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold block">Paciente</span>
          <span className="text-sm font-bold text-slate-800">{pacienteNombreCompleto}</span>
          <span className="text-xs text-slate-500 block">DNI: {ticket.paciente.dni}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Especialidad</span>
            <span className="text-sm font-semibold text-slate-800">{ticket.especialidad}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Médico</span>
            <span className="text-sm font-semibold text-slate-800">{ticket.medico}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Fecha de Cita</span>
            <span className="text-sm font-semibold text-slate-800">
              {new Date(ticket.fecha_cita + "T00:00:00").toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold block">Turno</span>
            <span className="text-sm font-semibold text-slate-800">
              {ticket.turno === "MANANA" ? "Mañana (08:00 - 12:00)" : "Tarde (14:00 - 18:00)"}
            </span>
          </div>
        </div>
      </div>

      {/* Código de barras simulado */}
      <div className="border-t border-dashed pt-5 flex flex-col items-center">
        <div className="flex space-x-1.5 h-12 w-4/5 justify-center mb-1">
          {BARCODE_WIDTHS.map((width, idx) => (
            <div key={idx} className="bg-black h-full" style={{ width: `${width * 2}px` }} />
          ))}
        </div>
        <span className="text-[10px] font-mono tracking-widest text-slate-400">
          *HHC-{ticket.paciente.dni}-{ticket.numero_ticket}*
        </span>
      </div>

      <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
        Presentarse 20 minutos antes de su cita en admisión.
      </div>
    </div>
  </div>
);

export default TicketCard;
