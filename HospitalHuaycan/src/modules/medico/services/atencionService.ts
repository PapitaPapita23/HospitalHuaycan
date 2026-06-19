import { apiGet, apiPut } from "../../../lib/apiClient";
import { CitaMedico, AtencionPasada, MedicamentoReceta } from "../types";

export interface TriajeRequest {
  fr: number;
  fc: number;
  temperatura: number;
  pa_sistolica: number;
  pa_diastolica: number;
  spo2: number;
  peso: number;
  talla: number;
  imc: number;
}

export interface ConsultaRequest {
  anamnesis: string;
  examen_fisico: string;
  diagnostico_cie10_principal: string;
  diagnosticos_secundarios: string[];
  tratamiento: string;
  indicaciones: string;
  medicamentos: MedicamentoReceta[];
}

export interface Cie10Diagnostico {
  codigo: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
}

/**
 * HU05: Registrar Triaje
 */
export async function registrarTriaje(citaId: number, data: TriajeRequest): Promise<any> {
  try {
    return await apiPut<any>(`/atenciones/${citaId}/triaje`, data);
  } catch (error: any) {
    throw new Error(error.message || "Error al registrar el triaje");
  }
}

/**
 * HU06/HU07: Registrar Consulta y Generar Receta
 */
export async function registrarConsulta(citaId: number, data: ConsultaRequest): Promise<any> {
  try {
    return await apiPut<any>(`/atenciones/${citaId}/consulta`, data);
  } catch (error: any) {
    throw new Error(error.message || "Error al registrar la consulta médica");
  }
}

/**
 * Obtener historial de atenciones de una historia clínica
 */
export async function obtenerHistorial(historiaClinicaId: number): Promise<AtencionPasada[]> {
  try {
    return await apiGet<AtencionPasada[]>(`/historias/${historiaClinicaId}/atenciones`);
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el historial clínico");
  }
}

/**
 * Buscar enfermedades por código o descripción en el catálogo CIE-10 (solo activos)
 */
export async function buscarCie10(query: string): Promise<Cie10Diagnostico[]> {
  try {
    return await apiGet<Cie10Diagnostico[]>(`/cie10/buscar?query=${encodeURIComponent(query)}`);
  } catch (error: any) {
    throw new Error(error.message || "Error al buscar en el catálogo CIE-10");
  }
}

/**
 * Obtiene todas las citas de hoy (para enfermería / triaje global)
 */
export async function obtenerAgendaHoyTodo(): Promise<CitaMedico[]> {
  try {
    return await apiGet<CitaMedico[]>("/atenciones/agenda-hoy");
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener la agenda de hoy");
  }
}
