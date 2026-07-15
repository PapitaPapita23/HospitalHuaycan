export interface ConteoItem {
  etiqueta: string; // valores exactos segun el campo: turno "MANANA"|"TARDE", estado "PENDIENTE"|"ATENDIDO"|"CANCELADO"|"NO_ASISTIO", estadoConsulta "PENDIENTE"|"EN_TRIAJE"|"EN_CONSULTA"|"FINALIZADO"
  total: number;
}

export interface ConteoPorFecha {
  fecha: string; // yyyy-MM-dd
  total: number;
}

export interface DashboardResumenDTO {
  fecha: string;
  totalCitasHoy: number;
  citasPorTurnoHoy: ConteoItem[];
  citasPorEstadoHoy: ConteoItem[];
  topEspecialidadesHoy: ConteoItem[];
  citasUltimos7Dias: ConteoPorFecha[];
  atencionesPorEstadoConsultaHoy: ConteoItem[];
  totalPacientesActivos: number;
  totalDocumentosEscaneados: number;
  totalDocumentosEscaneadosHoy: number;
  documentosUltimos7Dias: ConteoPorFecha[];
}
