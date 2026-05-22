import { supabase } from "../../../lib/supabase";
import { PacienteDTO, Especialidad, Medico, CitaResponseDTO, PatientState } from "../types";

export async function searchPatientByDni(dni: string): Promise<PatientState | null> {
  const { data, error } = await supabase.rpc("buscar_paciente_dni", { p_dni: dni });
  if (error) throw error;
  if (!data) return null;
  const p = data as PacienteDTO;
  return { id: p.id!, dni: p.dni, nombreCompleto: `${p.nombre} ${p.apellidos}`, isNew: false };
}

export async function registerPatientQuick(params: {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: "M" | "F";
}): Promise<PatientState> {
  const { data, error } = await supabase.rpc("registrar_paciente_rapido", {
    p_dni: params.dni,
    p_nombre: params.nombre,
    p_apellidos: params.apellidos,
    p_fecha_nacimiento: params.fechaNacimiento,
    p_genero: params.genero,
  });
  if (error) throw error;
  const p = data as PacienteDTO;
  return { id: p.id!, dni: p.dni, nombreCompleto: `${p.nombre} ${p.apellidos}`, isNew: true };
}

export async function fetchEspecialidades(): Promise<Especialidad[]> {
  const { data, error } = await supabase.rpc("get_especialidades");
  if (error) throw error;
  return (data as Especialidad[]) ?? [];
}

export async function fetchMedicosByEspecialidad(especialidadId: number): Promise<Medico[]> {
  const { data, error } = await supabase.rpc("get_medicos_especialidad", {
    p_especialidad_id: especialidadId,
  });
  if (error) throw error;
  return (data as Medico[]) ?? [];
}

export async function saveCita(params: {
  pacienteId: number;
  medicoId: number;
  especialidadId: number;
  fecha: string;
  turno: "MANANA" | "TARDE";
}): Promise<CitaResponseDTO> {
  const { data, error } = await supabase.rpc("registrar_cita_medica", {
    p_paciente_id: params.pacienteId,
    p_medico_id: params.medicoId,
    p_especialidad_id: params.especialidadId,
    p_fecha_cita: params.fecha,
    p_turno: params.turno,
  });
  if (error) throw error;
  return data as CitaResponseDTO;
}
