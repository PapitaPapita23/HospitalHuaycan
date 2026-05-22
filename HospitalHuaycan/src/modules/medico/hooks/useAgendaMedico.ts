import { useState, useEffect, useCallback } from "react";
import { CitaMedico } from "../types";
import { getAgendaHoy } from "../services/medicoService";

export function useAgendaMedico() {
  const [agenda, setAgenda]           = useState<CitaMedico[]>([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [selected, setSelected]       = useState<CitaMedico | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAgendaHoy();
      setAgenda(data);
    } catch {
      setError("No se pudo cargar la agenda. Verifique su sesión.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const pendientes  = agenda.filter((c) => c.estadoConsulta === "PENDIENTE").length;
  const atendidos   = agenda.filter((c) => c.estadoConsulta === "ATENDIDO").length;
  const enAtencion  = agenda.filter((c) => c.estadoConsulta === "EN_ATENCION").length;

  return { agenda, isLoading, error, selected, setSelected, load, pendientes, atendidos, enAtencion };
}
