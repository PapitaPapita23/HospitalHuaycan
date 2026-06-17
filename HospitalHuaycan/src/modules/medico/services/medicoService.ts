import { apiGet } from "../../../lib/apiClient";
import { CitaMedico } from "../types";

export async function getAgendaHoy(): Promise<CitaMedico[]> {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("Sesión no iniciada");

  try {
    return await apiGet<CitaMedico[]>("/consultas/agenda-hoy");
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener la agenda de hoy");
  }
}
