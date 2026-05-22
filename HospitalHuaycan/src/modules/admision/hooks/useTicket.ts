import { useMemo } from "react";
import { CitaResponseDTO } from "../types";

export function useTicket(ticket: CitaResponseDTO) {
  const fechaRegistro = useMemo(
    () =>
      new Date().toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    []
  );

  const pacienteNombreCompleto = ticket.paciente
    ? `${ticket.paciente.nombre || ""} ${ticket.paciente.apellidos || ""}`.trim()
    : "Paciente Sin Nombre";

  const handlePrint = () => window.print();

  return { fechaRegistro, pacienteNombreCompleto, handlePrint };
}
