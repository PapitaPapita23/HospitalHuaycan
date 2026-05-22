import React from "react";
import { CitaResponseDTO } from "./types";
import { useTicket } from "./hooks/useTicket";
import TicketSuccessHeader from "./components/TicketSuccessHeader";
import TicketCard from "./components/TicketCard";
import TicketActions from "./components/TicketActions";

interface TicketCitaProps {
  ticket: CitaResponseDTO;
  onClose: () => void;
}

const TicketCita: React.FC<TicketCitaProps> = ({ ticket, onClose }) => {
  const { fechaRegistro, pacienteNombreCompleto, handlePrint } = useTicket(ticket);

  return (
    <div className="flex flex-col items-center justify-center p-4 py-8 animate-fadeIn print:p-0 print:py-0">
      <TicketSuccessHeader />
      <TicketCard
        ticket={ticket}
        pacienteNombreCompleto={pacienteNombreCompleto}
        fechaRegistro={fechaRegistro}
      />
      <TicketActions onPrint={handlePrint} onClose={onClose} />
    </div>
  );
};

export default TicketCita;
