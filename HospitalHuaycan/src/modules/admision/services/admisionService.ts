import { supabase } from "../../../lib/supabase";
import { PacienteDTO, Especialidad, Medico, CitaResponseDTO, PatientState, AppointmentItem, SearchPatientResponse } from "../types";
import { apiGet } from "../../../lib/apiClient";

const APIPERU_TOKEN = "18155|w1r35b4TmjwlS8M8K8ephJs2TISPlIjyRcXGxRteb0bf321a";


/**
 * Consulta la API de RENIEC (ApiPeru) directamente desde el frontend usando el token provisto.
 */
export async function searchReniecDirectly(dni: string): Promise<{ nombre: string; apellidos: string } | null> {
  try {
    const response = await fetch("https://apiperu.dev/api/dni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${APIPERU_TOKEN}`
      },
      body: JSON.stringify({ dni })
    });
    if (response.ok) {
      const res = await response.json();
      if (res.success && res.data) {
        const nombres = res.data.nombres;
        const apePaterno = res.data.apellido_paterno ? res.data.apellido_paterno.trim() : "";
        const apeMaterno = res.data.apellido_materno ? res.data.apellido_materno.trim() : "";
        return {
          nombre: nombres,
          apellidos: `${apePaterno} ${apeMaterno}`.trim()
        };
      }
    }
  } catch (err) {
    console.error("Error al consultar APIPeru directamente en frontend:", err);
  }
  return null;
}

/**
 * Busca un paciente por DNI en el sistema de forma jerárquica:
 * 1. Consulta la base de datos de Supabase vía el RPC existente.
 * 2. Si no existe, intenta con el backend de Spring Boot. Si el backend retorna con id, se sincroniza.
 * 3. Si no está registrado en base de datos, llama a RENIEC (desde backend o frontend) y retorna sus datos sin registrarlos todavía.
 */
export async function searchPatientByDni(dni: string): Promise<SearchPatientResponse | null> {
  // Paso 1: Buscar en Supabase usando el RPC existente buscar_paciente_dni
  try {
    const { data, error } = await supabase.rpc("buscar_paciente_dni", { p_dni: dni });
    if (!error && data) {
      const p = data as PacienteDTO;
      return {
        registered: true,
        patient: {
          id: Number(p.id),
          dni: p.dni,
          nombreCompleto: `${p.nombre} ${p.apellidos}`,
          isNew: false
        }
      };
    }
    if (error) {
      console.warn("Error al buscar paciente vía RPC en Supabase, intentando backend:", error);
    }
  } catch (err) {
    console.warn("Excepción al buscar paciente vía RPC en Supabase, intentando backend:", err);
  }

  // Paso 2: Intentar con el backend local de Spring Boot
  try {
    const response = await fetch(`http://localhost:8080/api/pacientes/buscar?dni=${dni}`);
    if (response.ok) {
      const p = await response.json();
      
      // Si el backend retornó un id válido, significa que el paciente ya está registrado en la base de datos local de Spring Boot
      if (p.id) {
        // Lo sincronizamos en Supabase para obtener el ID correcto de Supabase
        try {
          const newPatient = await registerPatientQuick({
            dni: p.dni,
            nombre: p.nombre,
            apellidos: p.apellidos,
            fechaNacimiento: "1900-01-01",
            genero: "O"
          });
          return {
            registered: true,
            patient: {
              ...newPatient,
              isNew: false
            }
          };
        } catch (regErr) {
          // Si ya existía en Supabase (por ejemplo, duplicado de DNI)
          const { data: retryData } = await supabase.rpc("buscar_paciente_dni", { p_dni: dni });
          if (retryData) {
            const rp = retryData as PacienteDTO;
            return {
              registered: true,
              patient: {
                id: Number(rp.id),
                dni: rp.dni,
                nombreCompleto: `${rp.nombre} ${rp.apellidos}`,
                isNew: false
              }
            };
          }
        }
      } else {
        // Si no tiene ID (p.id es nulo o indefinido), significa que fue encontrado en RENIEC pero no guardado en la BD
        return {
          registered: false,
          reniecData: {
            nombre: p.nombre,
            apellidos: p.apellidos
          }
        };
      }
    }
  } catch (err) {
    console.warn("No se pudo conectar con el backend de Spring Boot, intentando RENIEC directo:", err);
  }

  // Paso 3: Consultar RENIEC directamente desde el frontend y retornar sin guardar en base de datos todavía
  const reniecData = await searchReniecDirectly(dni);
  if (reniecData) {
    return {
      registered: false,
      reniecData: {
        nombre: reniecData.nombre,
        apellidos: reniecData.apellidos
      }
    };
  }

  return { registered: false };
}

/**
 * Registra un nuevo paciente usando el RPC existente registrar_paciente_rapido.
 */
export async function registerPatientQuick(params: {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: "M" | "F" | "O";
}): Promise<PatientState> {
  const { data, error } = await supabase.rpc("registrar_paciente_rapido", {
    p_dni: params.dni,
    p_nombre: params.nombre,
    p_apellidos: params.apellidos,
    p_fecha_nacimiento: params.fechaNacimiento,
    p_genero: params.genero
  });

  if (error) {
    // Si la base de datos devuelve error de DNI duplicado
    if (error.message && error.message.includes("duplicate key") || error.code === "23505") {
      throw new Error("DUPLICATE_DNI");
    }
    throw error;
  }

  const p = data as PacienteDTO;
  return {
    id: Number(p.id),
    dni: p.dni,
    nombreCompleto: `${p.nombre} ${p.apellidos}`,
    isNew: true
  };
}

/**
 * Obtiene todas las especialidades activas usando el RPC existente get_especialidades.
 */
export async function fetchEspecialidades(): Promise<Especialidad[]> {
  const { data, error } = await supabase.rpc("get_especialidades");
  if (error) throw error;
  return (data as Especialidad[]) ?? [];
}

/**
 * Obtiene todos los médicos activos de una especialidad usando el RPC existente get_medicos_especialidad.
 */
export async function fetchMedicosByEspecialidad(especialidadId: number): Promise<Medico[]> {
  const { data, error } = await supabase.rpc("get_medicos_especialidad", {
    p_especialidad_id: especialidadId
  });

  if (error) throw error;

  return (data as any[]).map((m) => ({
    id: Number(m.id),
    nombreCompleto: m.nombreCompleto
  }));
}

/**
 * Registra una cita médica usando el RPC existente registrar_cita_medica.
 */
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
    p_turno: params.turno
  });

  if (error) throw error;
  return data as CitaResponseDTO;
}

/**
 * Obtiene todas las citas de hoy desde el backend de Spring Boot para mostrarlas en la tabla del dashboard de admisión.
 */
export async function fetchCitasHoy(fecha?: string): Promise<AppointmentItem[]> {
  try {
    const path = fecha ? `/citas?fecha=${fecha}` : "/citas";
    return await apiGet<AppointmentItem[]>(path);
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener las citas de admisión");
  }
}

