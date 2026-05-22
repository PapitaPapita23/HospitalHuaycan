import React, { useState, useEffect } from "react";
import TicketCita from "./TicketCita";
import { PacienteDTO, Especialidad, Medico, CitaResponseDTO } from "./types";
import { 
  IoSearchOutline, 
  IoPersonAddOutline, 
  IoCalendarOutline, 
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from "react-icons/io5";

interface PatientState {
  id: number;
  dni: string;
  nombreCompleto: string;
  isNew?: boolean;
}

const GenerarCitaFlujo: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard }) => {
  // Pasos del Flujo: 1 = Buscar/Registrar Paciente, 2 = Seleccionar detalles de Cita
  const [step, setStep] = useState<1 | 2>(1);
  
  // Paso A: Datos de Búsqueda de Paciente
  const [dniQuery, setDniQuery] = useState("");
  const [patient, setPatient] = useState<PatientState | null>(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");

  // Paso B: Detalles de la Cita (cargados dinámicamente)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [especialidadId, setEspecialidadId] = useState<number | "">("");
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [medicoId, setMedicoId] = useState<number | "">("");
  const [fecha, setFecha] = useState("");
  const [turno, setTurno] = useState<"MANANA" | "TARDE">("MANANA");

  // Validación y Estados de UX
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<CitaResponseDTO | null>(null);

  // Cargar Especialidades al montar el componente
  useEffect(() => {
    const fetchEspecialidades = async () => {
      setIsLoadingData(true);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.global;
        return copy;
      });
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/especialidades", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data: Especialidad[] = await response.json();
          setEspecialidades(data);
        } else {
          setErrors((prev) => ({ ...prev, global: "No se pudieron cargar las especialidades de la base de datos." }));
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        setErrors((prev) => ({ ...prev, global: "Error de conexión al servidor de base de datos." }));
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchEspecialidades();
  }, []);

  // Cargar Médicos según Especialidad seleccionada
  useEffect(() => {
    setMedicoId("");
    setMedicos([]);
    if (especialidadId) {
      const fetchMedicos = async () => {
        setIsLoadingData(true);
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:8080/api/medicos?especialidadId=${especialidadId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data: Medico[] = await response.json();
            setMedicos(data);
          } else {
            setErrors((prev) => ({ ...prev, medico: "No se pudieron cargar los médicos asignados." }));
          }
        } catch (error) {
          console.error("Error fetching doctors:", error);
          setErrors((prev) => ({ ...prev, medico: "Error de conexión al servidor para cargar médicos." }));
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchMedicos();
    }
  }, [especialidadId]);

  // Obtener fecha de hoy en formato local YYYY-MM-DD
  const getTodayString = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Buscar Paciente por DNI en el Backend
  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dniQuery.length !== 8 || !/^\d+$/.test(dniQuery)) {
      setErrors({ dniQuery: "El DNI debe tener exactamente 8 caracteres numéricos." });
      return;
    }
    
    setErrors({});
    setIsSearching(true);
    setPatient(null);
    setPatientNotFound(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/pacientes/buscar?dni=${dniQuery}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: PacienteDTO = await response.json();
        if (data.id === null || data.id === undefined) {
          // El paciente existe en APIPeru pero no en la base de datos local
          setPatientNotFound(true);
          setNewPatientName(data.nombre || "");
          setNewPatientLastName(data.apellidos || "");
          setPatient(null);
        } else {
          // El paciente ya está registrado localmente
          setPatient({
            id: data.id,
            dni: data.dni,
            nombreCompleto: `${data.nombre} ${data.apellidos}`,
            isNew: false
          });
        }
      } else if (response.status === 404) {
        setPatientNotFound(true);
      } else {
        setErrors({ dniQuery: "Error al buscar el paciente. Código de estado: " + response.status });
      }
    } catch (error) {
      console.error("Error searching patient:", error);
      setErrors({ dniQuery: "Error de conexión con el servidor." });
    } finally {
      setIsSearching(false);
    }
  };

  // Registrar un paciente nuevo en el Backend (Registro Rápido)
  const handleRegisterNewPatient = async () => {
    const tempErrors: Record<string, string> = {};
    if (!newPatientName.trim()) tempErrors.newPatientName = "El nombre es obligatorio.";
    if (!newPatientLastName.trim()) tempErrors.newPatientLastName = "Los apellidos son obligatorios.";

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});
    setIsRegistering(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/pacientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          dni: dniQuery,
          nombre: newPatientName.trim(),
          apellidos: newPatientLastName.trim()
        }),
      });

      if (response.status === 201) {
        const data: PacienteDTO = await response.json();
        setPatient({
          id: data.id!,
          dni: data.dni,
          nombreCompleto: `${data.nombre} ${data.apellidos}`,
          isNew: true
        });
        setPatientNotFound(false);
        setNewPatientName("");
        setNewPatientLastName("");
      } else if (response.status === 409) {
        setErrors({ global: "El paciente ya se encuentra registrado con ese DNI." });
      } else {
        setErrors({ global: "Ocurrió un error al registrar el paciente en la base de datos." });
      }
    } catch (error) {
      console.error("Error registering patient:", error);
      setErrors({ global: "Error de conexión al intentar guardar el paciente." });
    } finally {
      setIsRegistering(false);
    }
  };

  // Continuar al paso de cita médica
  const handleContinueToCita = () => {
    if (!patient) return;
    setStep(2);
  };

  // Validar Paso de Cita Médica
  const validateCita = (): boolean => {
    const tempErrors: Record<string, string> = {};
    const todayStr = getTodayString();

    if (!especialidadId) tempErrors.especialidad = "Debe seleccionar una especialidad.";
    if (!medicoId) tempErrors.medico = "Debe seleccionar un médico.";
    if (!fecha) {
      tempErrors.fecha = "Debe ingresar una fecha para la cita.";
    } else if (fecha < todayStr) {
      tempErrors.fecha = "La fecha no puede ser anterior a hoy.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Enviar Cita al Backend (POST a /api/citas)
  const handleSaveCita = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCita() || !patient) return;

    setIsSaving(true);
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.global;
      return copy;
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          paciente_id: patient.id,
          medico_id: Number(medicoId),
          especialidad_id: Number(especialidadId),
          fecha_cita: fecha,
          turno: turno
        }),
      });

      if (response.status === 201) {
        const data: CitaResponseDTO = await response.json();
        setGeneratedTicket(data);
      } else {
        const errorText = await response.text();
        setErrors({ global: errorText || "Ocurrió un error al agendar la cita médica en el servidor." });
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      setErrors({ global: "Error de conexión al guardar la cita." });
    } finally {
      setIsSaving(false);
    }
  };

  // Restablecer flujo
  const handleReset = () => {
    setStep(1);
    setDniQuery("");
    setPatient(null);
    setPatientNotFound(false);
    setNewPatientName("");
    setNewPatientLastName("");
    setEspecialidadId("");
    setMedicoId("");
    setFecha("");
    setTurno("MANANA");
    setErrors({});
    setGeneratedTicket(null);
  };

  // Si ya se ha generado el ticket
  if (generatedTicket) {
    return <TicketCita ticket={generatedTicket} onClose={handleReset} />;
  }

  // Deshabilitar botón de guardar cita si hay campos vacíos o errores detectados
  const isCitaFormInvalid = !especialidadId || !medicoId || !fecha || !!errors.especialidad || !!errors.medico || !!errors.fecha;

  return (
    <div className="max-w-2xl mx-auto py-2">
      {/* Indicador de Pasos */}
      <div className="mb-8 print:hidden">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
              step === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-emerald-100 text-emerald-700"
            }`}>
              {step > 1 ? <IoCheckmarkCircleOutline className="w-5 h-5" /> : "1"}
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1.5">Paciente</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${step > 1 ? "bg-emerald-200" : "bg-slate-100"}`} />
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
              step === 2 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-400"
            }`}>
              2
            </div>
            <span className="text-[11px] font-medium text-slate-400 mt-1.5">Cita Médica</span>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        
        {/* Errores globales o de conexión */}
        {errors.global && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-700 text-sm font-medium animate-slideUp">
            <IoAlertCircleOutline className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span>{errors.global}</span>
          </div>
        )}

        {/* PASO 1: BÚSQUEDA Y REGISTRO DE PACIENTE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#0A1733] mb-1">Paso 1: Identificación del Paciente</h3>
              <p className="text-xs text-slate-400">Busque al paciente en el sistema por su número de DNI.</p>
            </div>

            {/* Formulario de búsqueda por DNI */}
            <form onSubmit={handleSearchPatient} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Ingrese DNI (8 dígitos)"
                  value={dniQuery}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                    setDniQuery(val);
                    if (errors.dniQuery) setErrors((prev) => ({ ...prev, dniQuery: "" }));
                  }}
                  className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-lg text-sm transition-all focus:bg-white focus:ring-4 ${
                    errors.dniQuery ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                />
                <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
              <button
                type="submit"
                disabled={isSearching || dniQuery.length !== 8}
                className="px-5 py-2.5 bg-[#0A1733] hover:bg-[#122854] disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isSearching ? "Buscando..." : "Buscar"}
              </button>
            </form>
            {errors.dniQuery && (
              <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1">
                <IoAlertCircleOutline className="w-4 h-4" />
                {errors.dniQuery}
              </p>
            )}

            {/* Paciente Encontrado */}
            {patient && !patientNotFound && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between animate-slideUp">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">Paciente Identificado</span>
                  <h4 className="text-base font-bold text-slate-800">{patient.nombreCompleto}</h4>
                  <p className="text-xs text-slate-500">DNI: {patient.dni} {patient.isNew && <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">Nuevo Registro</span>}</p>
                </div>
                <button
                  onClick={handleContinueToCita}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            )}

            {/* Paciente No Encontrado - Formulario Rápido */}
            {patientNotFound && (
              <div className="p-5 border border-amber-200 bg-amber-50/30 rounded-xl space-y-4 animate-slideUp">
                <div className="flex items-start gap-2.5">
                  <IoPersonAddOutline className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800">Paciente no registrado</h4>
                    <p className="text-xs text-amber-700">Ingrese los datos para registrarlo rápidamente en el sistema.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre(s) *</label>
                    <input
                      type="text"
                      placeholder="Nombres"
                      value={newPatientName}
                      onChange={(e) => {
                        setNewPatientName(e.target.value);
                        if (errors.newPatientName) setErrors((prev) => ({ ...prev, newPatientName: "" }));
                      }}
                      className={`w-full px-3.5 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-4 ${
                        errors.newPatientName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/10"
                      }`}
                    />
                    {errors.newPatientName && <span className="text-red-500 text-[11px] mt-1 block">{errors.newPatientName}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Apellido(s) *</label>
                    <input
                      type="text"
                      placeholder="Apellidos"
                      value={newPatientLastName}
                      onChange={(e) => {
                        setNewPatientLastName(e.target.value);
                        if (errors.newPatientLastName) setErrors((prev) => ({ ...prev, newPatientLastName: "" }));
                      }}
                      className={`w-full px-3.5 py-2 border rounded-lg text-sm bg-white outline-none focus:ring-4 ${
                        errors.newPatientLastName ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/10"
                      }`}
                    />
                    {errors.newPatientLastName && <span className="text-red-500 text-[11px] mt-1 block">{errors.newPatientLastName}</span>}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isRegistering}
                  onClick={handleRegisterNewPatient}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-semibold rounded-lg text-xs transition-all cursor-pointer"
                >
                  {isRegistering ? "Registrando en BD..." : "Registrar Paciente Temporal"}
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <IoArrowBackOutline className="w-4 h-4" />
                Volver al Panel
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: AGENDAR DETALLES DE CITA */}
        {step === 2 && patient && (
          <form onSubmit={handleSaveCita} className="space-y-6">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#0A1733]">Paso 2: Detalles de la Cita</h3>
                <p className="text-xs text-slate-400">Asigne la especialidad, médico y horario.</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">Paciente:</span>
                <span className="text-sm font-bold text-slate-700">{patient.nombreCompleto}</span>
              </div>
            </div>

            {/* Spinner para indicar carga de datos */}
            {isLoadingData && (
              <div className="flex items-center justify-center py-2 text-slate-400 text-xs gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Cargando información médica de la base de datos...
              </div>
            )}

            {/* Especialidad */}
            <div>
              <label htmlFor="especialidad" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Especialidad *
              </label>
              <select
                id="especialidad"
                value={especialidadId}
                onChange={(e) => {
                  setEspecialidadId(e.target.value ? Number(e.target.value) : "");
                  if (errors.especialidad) setErrors((prev) => ({ ...prev, especialidad: "" }));
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 ${
                  errors.especialidad ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/10"
                }`}
              >
                <option value="">Seleccione especialidad</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                ))}
              </select>
              {errors.especialidad && (
                <span className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <IoAlertCircleOutline className="w-4 h-4" />
                  {errors.especialidad}
                </span>
              )}
            </div>

            {/* Médico */}
            <div>
              <label htmlFor="medico" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Médico Asignado *
              </label>
              <select
                id="medico"
                value={medicoId}
                disabled={!especialidadId}
                onChange={(e) => {
                  setMedicoId(e.target.value ? Number(e.target.value) : "");
                  if (errors.medico) setErrors((prev) => ({ ...prev, medico: "" }));
                }}
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 ${
                  !especialidadId ? "opacity-60 cursor-not-allowed" : ""
                } ${errors.medico ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/10"}`}
              >
                <option value="">Seleccione médico</option>
                {medicos.map((med) => (
                  <option key={med.id} value={med.id}>{med.nombreCompleto}</option>
                ))}
              </select>
              {errors.medico && (
                <span className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                  <IoAlertCircleOutline className="w-4 h-4" />
                  {errors.medico}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fecha */}
              <div>
                <label htmlFor="fecha" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Fecha de la Cita *
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  min={getTodayString()}
                  onChange={(e) => {
                    setFecha(e.target.value);
                    if (errors.fecha) setErrors((prev) => ({ ...prev, fecha: "" }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 ${
                    errors.fecha ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-500/10"
                  }`}
                />
                {errors.fecha && (
                  <span className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                    <IoAlertCircleOutline className="w-4 h-4" />
                    {errors.fecha}
                  </span>
                )}
              </div>

              {/* Turno */}
              <div>
                <label htmlFor="turno" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Turno
                </label>
                <select
                  id="turno"
                  value={turno}
                  onChange={(e) => setTurno(e.target.value as "MANANA" | "TARDE")}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:bg-white focus:ring-4 focus:border-blue-500 focus:ring-blue-500/10"
                >
                  <option value="MANANA">Mañana</option>
                  <option value="TARDE">Tarde</option>
                </select>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-4 border-t border-slate-100 flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <IoArrowBackOutline className="w-4 h-4" />
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSaving || isCitaFormInvalid}
                className={`px-6 py-2.5 text-white font-semibold rounded-lg text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSaving || isCitaFormInvalid
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
                }`}
              >
                {isSaving ? "Guardando Cita..." : "Guardar Cita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GenerarCitaFlujo;
