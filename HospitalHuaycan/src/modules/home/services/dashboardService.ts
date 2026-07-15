import { apiGet } from "../../../lib/apiClient";
import { DashboardResumenDTO } from "../types";

export async function fetchDashboardResumen(fecha?: string): Promise<DashboardResumenDTO> {
  try {
    const path = fecha ? `/dashboard/resumen?fecha=${fecha}` : "/dashboard/resumen";
    return await apiGet<DashboardResumenDTO>(path);
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el resumen del dashboard");
  }
}
