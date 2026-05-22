import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";

const TicketSuccessHeader: React.FC = () => (
  <div className="text-center mb-6 print:hidden">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-3">
      <IoCheckmarkCircle className="w-8 h-8" />
    </div>
    <h2 className="text-2xl font-bold text-[#0A1733]">¡Cita Registrada!</h2>
    <p className="text-sm text-slate-500">Se ha generado el comprobante de la cita médica.</p>
  </div>
);

export default TicketSuccessHeader;
