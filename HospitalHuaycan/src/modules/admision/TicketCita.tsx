import React, { useMemo } from "react";
import { IoPrintOutline, IoArrowBackOutline, IoCheckmarkCircle } from "react-icons/io5";
import { CitaResponseDTO } from "./types";

interface TicketCitaProps {
  ticket: CitaResponseDTO;
  onClose: () => void;
}

const TicketCita: React.FC<TicketCitaProps> = ({ ticket, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Generar la fecha/hora de registro (impresión del comprobante)
  const fechaRegistro = useMemo(() => {
    return new Date().toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }, []);

  const pacienteNombreCompleto = `${ticket.paciente.nombre} ${ticket.paciente.apellidos}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 py-8 animate-fadeIn">
      {/* Mensaje de Éxito en Pantalla - Oculto en impresión */}
      <div className="text-center mb-6 print:hidden">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-3">
          <IoCheckmarkCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#0A1733]">¡Cita Registrada!</h2>
        <p className="text-sm text-slate-500">Se ha generado el comprobante de la cita médica.</p>
      </div>

      {/* Recibo / Ticket */}
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
          <div className="flex justify-between items-center text-xs text-slate-400 border-b border-dashed pb-3">
            <span>TICKET N°: <strong className="text-slate-800 font-semibold">{ticket.numero_ticket}</strong></span>
            <span>REGISTRO: <strong>{fechaRegistro}</strong></span>
          </div>

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
                    year: "numeric"
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
              {[1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1].map((width, idx) => (
                <div
                  key={idx}
                  className="bg-black h-full"
                  style={{ width: `${width * 2}px` }}
                />
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

      {/* Botones de acción - Ocultos al Imprimir */}
      <div className="flex gap-4 w-full max-w-sm mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md shadow-emerald-600/15 transition-all cursor-pointer"
        >
          <IoPrintOutline className="w-5 h-5" />
          Imprimir
        </button>
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
        >
          <IoArrowBackOutline className="w-5 h-5" />
          Volver
        </button>
      </div>
    </div>
  );
};

export default TicketCita;
