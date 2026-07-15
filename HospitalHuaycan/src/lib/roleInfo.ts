import { IconType } from "react-icons";
import {
  IoPeopleOutline,
  IoPulseOutline,
  IoHeartHalfOutline,
  IoFolderOpenOutline,
  IoPersonOutline,
} from "react-icons/io5";

export interface RoleInfo {
  label: string;
  area: string;
  modulePath: string | null;
  moduleLabel: string | null;
  icon: IconType;
  permisos: string[];
}

const DEFAULT_ROLE: RoleInfo = {
  label: "Usuario del sistema",
  area: "Hospital de Huaycán",
  modulePath: null,
  moduleLabel: null,
  icon: IoPersonOutline,
  permisos: ["Acceso al panel general del sistema"],
};

export const ROLE_INFO: Record<string, RoleInfo> = {
  ROLE_ADMISION: {
    label: "Personal de Admisión",
    area: "Unidad de Admisión y Citas",
    modulePath: "/admision",
    moduleLabel: "Admisión",
    icon: IoPeopleOutline,
    permisos: [
      "Registrar y buscar pacientes",
      "Agendar citas médicas por especialidad",
      "Generar e imprimir tickets de atención",
      "Consultar la agenda de citas del día",
    ],
  },
  ROLE_MEDICO: {
    label: "Médico",
    area: "Consulta Externa",
    modulePath: "/medico",
    moduleLabel: "Médico",
    icon: IoPulseOutline,
    permisos: [
      "Atender las consultas asignadas del día",
      "Registrar diagnósticos con código CIE-10",
      "Emitir e imprimir recetas médicas",
      "Consultar el historial clínico del paciente",
    ],
  },
  ROLE_ENFERMERIA: {
    label: "Enfermería / Triaje",
    area: "Unidad de Triaje",
    modulePath: "/triaje",
    moduleLabel: "Triaje",
    icon: IoHeartHalfOutline,
    permisos: [
      "Registrar signos vitales (triaje)",
      "Consultar la agenda de atenciones del día",
      "Derivar pacientes a consulta médica",
    ],
  },
  ROLE_ARCHIVO: {
    label: "Personal de Archivo",
    area: "Archivo de Historias Clínicas",
    modulePath: "/archivo",
    moduleLabel: "Archivo",
    icon: IoFolderOpenOutline,
    permisos: [
      "Buscar expedientes e historias clínicas",
      "Digitalizar documentos (PC, webcam y celular QR)",
      "Extraer texto con IA (OCR)",
      "Gestionar documentos del expediente",
    ],
  },
};

export function getRoleInfo(rol: string | null | undefined): RoleInfo {
  if (!rol) return DEFAULT_ROLE;
  return ROLE_INFO[rol] ?? DEFAULT_ROLE;
}
