import { useState, useEffect, useCallback } from "react";
import { DashboardResumenDTO } from "../types";
import { fetchDashboardResumen } from "../services/dashboardService";

export function useDashboardResumen() {
  const [resumen, setResumen]     = useState<DashboardResumenDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [fecha, setFecha]         = useState<string | null>(null); // null = hoy

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardResumen(fecha ?? undefined);
      setResumen(data);
    } catch (err: any) {
      setError(err.message || "Error al conectar con la base de datos.");
    } finally {
      setIsLoading(false);
    }
  }, [fecha]);

  useEffect(() => { load(); }, [load]);

  return { resumen, isLoading, error, load, fecha, setFecha };
}
