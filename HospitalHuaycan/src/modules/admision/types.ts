export interface PacienteDTO {
  id?: number;
  dni: string;
  nombre: string;
  apellidos: string;
}

export interface CitaRequestDTO {
  paciente_id: number;
  medico_id: number;
  especialidad_id: number;
  fecha_cita: string;
  turno: "MANANA" | "TARDE";
}

export interface CitaResponseDTO {
  paciente: PacienteDTO;
  medico: string;
  especialidad: string;
  fecha_cita: string;
  turno: "MANANA" | "TARDE";
  numero_ticket: string;
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  activo?: boolean;
}

export interface Medico {
  id: number;
  nombreCompleto: string;
}

export interface PatientState {
  id: number;
  dni: string;
  nombreCompleto: string;
  isNew?: boolean;
}

export interface SearchPatientResponse {
  registered: boolean;
  patient?: PatientState;
  reniecData?: { nombre: string; apellidos: string };
}

export interface AppointmentItem {
  id: string;
  paciente: string;
  dni: string;
  especialidad: string;
  medico: string;
  turno: "MANANA" | "TARDE";
  fecha: string;
  estado: "CONFIRMADA" | "ATENDIDA" | "CANCELADA";
}
