export interface PacienteBusqueda {
  pacienteId: number;
  dni: string;
  nombres: string;
  apellidos: string;
  genero: string;
  edad: number;
  grupoSanguineo: string;
  alergias: string;
  estadoSis: boolean;
  historiaClinicaId: number;
  fechaCreacionExpediente: string;
}
