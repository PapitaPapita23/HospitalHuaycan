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
  fecha_cita: string; // Formato YYYY-MM-DD
  turno: 'MANANA' | 'TARDE';
}

export interface CitaResponseDTO {
  paciente: PacienteDTO;
  medico: string;
  especialidad: string;
  fecha_cita: string; // Formato YYYY-MM-DD
  turno: 'MANANA' | 'TARDE';
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
