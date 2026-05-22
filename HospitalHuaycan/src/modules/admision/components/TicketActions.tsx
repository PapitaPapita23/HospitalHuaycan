import React from "react";
import { IoPrintOutline, IoArrowBackOutline } from "react-icons/io5";

interface TicketActionsProps {
  onPrint: () => void;
  onClose: () => void;
}

const TicketActions: React.FC<TicketActionsProps> = ({ onPrint, onClose }) => (
  <div className="flex gap-4 w-full max-w-sm mt-6 print:hidden">
    <button
      onClick={onPrint}
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
);

export default TicketActions;
