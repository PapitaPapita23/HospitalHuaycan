export interface MedicamentoReceta {
  medicamento: string;
  concentracion: string;
  forma_farmaceutica: string;
  dosis: string;
  frecuencia: string;
  duracion_dias: number;
  indicaciones_especiales?: string;
}

export interface AtencionPasada {
  fechaAtencion: string;
  fr: number;
  fc: number;
  temperatura: number;
  paSistolica: number;
  paDiastolica: number;
  spo2: number;
  peso: number;
  talla: number;
  imc: number;
  escalaDolor: number;
  anamnesis: string;
  examenFisico: string;
  diagnosticoCie10Principal: string;
  diagnosticoDescripcion: string;
  diagnosticosSecundarios: string;
  tratamiento: string;
  indicaciones: string;
  solicitudExamenes: string;
  recetas?: MedicamentoReceta[];
}

export interface CitaMedico {
  citaId: number;
  horaInicio: string;      // "HH:mm:ss" — Java LocalTime
  estadoConsulta: string;  // "PENDIENTE" | "ATENDIDO" | "EN_ATENCION" | "CANCELADO"
  pacienteDni: string;
  pacienteNombres: string;
  historiaClinicaId?: number;
  historialConsultas: AtencionPasada[];
  documentosEscaneados: any[];
}

