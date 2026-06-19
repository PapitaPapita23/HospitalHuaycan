import { useState, useEffect } from "react";
import { Especialidad, Medico, CitaResponseDTO, PatientState } from "../types";
import {
  searchPatientByDni,
  registerPatientQuick,
  fetchEspecialidades,
  fetchMedicosByEspecialidad,
  saveCita,
} from "../services/admisionService";

const getTodayString = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export function useCitaForm() {
  const [step, setStep] = useState<1 | 2>(1);

  // Paso 1 — paciente
  const [dniQuery, setDniQuery] = useState("");
  const [patient, setPatient] = useState<PatientState | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientBirthDate, setNewPatientBirthDate] = useState("");
  const [newPatientGenero, setNewPatientGenero] = useState<"M" | "F">("M");

  // Paso 2 — cita
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialidadId, setEspecialidadId] = useState<number | "">("");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [turno, setTurno] = useState<"MANANA" | "TARDE">("MANANA");

  // UX
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<CitaResponseDTO | null>(null);

  // Cargar especialidades al montar
  useEffect(() => {
    const load = async () => {
      setIsLoadingData(true);
      setErrors((prev) => { const c = { ...prev }; delete c.global; return c; });
      try {
        setEspecialidades(await fetchEspecialidades());
      } catch {
        setErrors((prev) => ({ ...prev, global: "No se pudieron cargar las especialidades." }));
      } finally {
        setIsLoadingData(false);
      }
    };
    load();
  }, []);

  // Cargar médicos cuando cambia la especialidad
  useEffect(() => {
    setMedicoId("");
    setMedicos([]);
    if (!especialidadId) return;
    const load = async () => {
      setIsLoadingData(true);
      try {
        setMedicos(await fetchMedicosByEspecialidad(especialidadId as number));
      } catch {
        setErrors((prev) => ({ ...prev, medico: "No se pudieron cargar los médicos." }));
      } finally {
        setIsLoadingData(false);
      }
    };
    load();
  }, [especialidadId]);

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dniQuery.length !== 8 || !/^\d+$/.test(dniQuery)) {
      setErrors({ dniQuery: "El DNI debe tener exactamente 8 dígitos numéricos." });
      return;
    }
    setErrors({});
    setIsSearching(true);
    setPatient(null);
    setPatientNotFound(false);
    setNewPatientName("");
    setNewPatientLastName("");
    setNewPatientBirthDate("");
    try {
      const result = await searchPatientByDni(dniQuery);
      if (result && result.registered && result.patient) {
        setPatient(result.patient);
        setPatientNotFound(false);
      } else {
        setPatientNotFound(true);
        if (result && result.reniecData) {
          setNewPatientName(result.reniecData.nombre || "");
          setNewPatientLastName(result.reniecData.apellidos || "");
        }
      }
    } catch {
      setErrors({ dniQuery: "Error al buscar el paciente en la base de datos." });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegisterNewPatient = async () => {
    const tempErrors: Record<string, string> = {};
    if (!newPatientName.trim()) tempErrors.newPatientName = "El nombre es obligatorio.";
    if (!newPatientLastName.trim()) tempErrors.newPatientLastName = "Los apellidos son obligatorios.";
    if (!newPatientBirthDate) tempErrors.newPatientBirthDate = "La fecha de nacimiento es obligatoria.";
    if (Object.keys(tempErrors).length > 0) { setErrors(tempErrors); return; }

    setErrors({});
    setIsRegistering(true);
    try {
      const result = await registerPatientQuick({
        dni: dniQuery,
        nombre: newPatientName.trim(),
        apellidos: newPatientLastName.trim(),
        fechaNacimiento: newPatientBirthDate,
        genero: newPatientGenero,
      });
      setPatient(result);
      setPatientNotFound(false);
      setNewPatientName(""); setNewPatientLastName(""); setNewPatientBirthDate("");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "";
      if (msg.includes("DUPLICATE_DNI")) {
        setErrors({ global: "El paciente ya se encuentra registrado con ese DNI." });
      } else {
        setErrors({ global: "Error al registrar el paciente en la base de datos." });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleContinueToCita = () => {
    if (patient) setStep(2);
  };

  const handleSaveCita = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: Record<string, string> = {};
    const today = getTodayString();
    if (!especialidadId) tempErrors.especialidad = "Seleccione una especialidad.";
    if (!medicoId) tempErrors.medico = "Seleccione un médico.";
    if (!fecha) tempErrors.fecha = "Ingrese una fecha.";
    else if (fecha < today) tempErrors.fecha = "La fecha no puede ser anterior a hoy.";
    if (Object.keys(tempErrors).length > 0) { setErrors(tempErrors); return; }

    setErrors((prev) => { const c = { ...prev }; delete c.global; return c; });
    setIsSaving(true);
    try {
      const ticket = await saveCita({
        pacienteId: patient!.id,
        medicoId: Number(medicoId),
        especialidadId: Number(especialidadId),
        fecha,
        turno,
      });
      setGeneratedTicket(ticket);
    } catch {
      setErrors({ global: "Error al guardar la cita médica." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setStep(1); setDniQuery(""); setPatient(null); setPatientNotFound(false);
    setNewPatientName(""); setNewPatientLastName(""); setNewPatientBirthDate(""); setNewPatientGenero("M");
    setEspecialidadId(""); setMedicoId(""); setFecha(""); setTurno("MANANA");
    setErrors({}); setGeneratedTicket(null);
  };

  const isCitaFormInvalid =
    !especialidadId || !medicoId || !fecha ||
    !!errors.especialidad || !!errors.medico || !!errors.fecha;

  return {
    step, setStep,
    dniQuery, setDniQuery,
    patient,
    patientNotFound,
    newPatientName, setNewPatientName,
    newPatientLastName, setNewPatientLastName,
    newPatientBirthDate, setNewPatientBirthDate,
    newPatientGenero, setNewPatientGenero,
    especialidades,
    especialidadId, setEspecialidadId,
    medicos,
    medicoId, setMedicoId,
    fecha, setFecha,
    turno, setTurno,
    errors, setErrors,
    isSearching, isRegistering, isSaving, isLoadingData,
    generatedTicket,
    isCitaFormInvalid,
    getTodayString,
    handleSearchPatient,
    handleRegisterNewPatient,
    handleContinueToCita,
    handleSaveCita,
    handleReset,
  };
}
