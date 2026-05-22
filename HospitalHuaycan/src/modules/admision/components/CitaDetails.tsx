import React from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import { Especialidad, Medico, PatientState } from "../types";

interface CitaDetailsProps {
  patient: PatientState;
  especialidades: Especialidad[];
  especialidadId: number | "";
  setEspecialidadId: (v: number | "") => void;
  medicos: Medico[];
  medicoId: number | "";
  setMedicoId: (v: number | "") => void;
  fecha: string;
  setFecha: (v: string) => void;
  turno: "MANANA" | "TARDE";
  setTurno: (v: "MANANA" | "TARDE") => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSaving: boolean;
  isLoadingData: boolean;
  isCitaFormInvalid: boolean;
  getTodayString: () => string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CitaDetails: React.FC<CitaDetailsProps> = ({
  patient,
  especialidades, especialidadId, setEspecialidadId,
  medicos, medicoId, setMedicoId,
  fecha, setFecha,
  turno, setTurno,
  errors, setErrors,
  isSaving, isLoadingData, isCitaFormInvalid,
  getTodayString, onBack, onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">

    {/* Resumen paciente */}
    <div className="flex items-center gap-3 p-3 bg-[#ECF4FC] rounded-xl">
      <div className="w-8 h-8 rounded-full bg-[#0A1733] flex items-center justify-center shrink-0">
        <span className="text-[9px] font-black text-white">
          {patient.nombreCompleto.split(" ").slice(0, 2).map((n) => n[0]).join("")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Paciente</p>
        <p className="text-sm font-black text-[#0A1733] leading-tight truncate">{patient.nombreCompleto}</p>
      </div>
      <button type="button" onClick={onBack} className="text-[11px] text-slate-400 hover:text-[#CA0000] font-bold transition-colors">
        Cambiar
      </button>
    </div>

    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Paso 2 de 2</p>
      <h3 className="text-xl font-black text-[#0A1733] leading-tight">Detalles de la Cita</h3>
    </div>

    {isLoadingData && (
      <div className="flex items-center gap-2.5 text-slate-400 text-xs py-1">
        <div className="w-4 h-4 border-2 border-[#CA0000] border-t-transparent rounded-full animate-spin shrink-0" />
        Cargando información médica…
      </div>
    )}

    {/* Especialidad */}
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Especialidad *</label>
      <select
        value={especialidadId}
        onChange={(e) => { setEspecialidadId(e.target.value ? Number(e.target.value) : ""); if (errors.especialidad) setErrors((p) => ({ ...p, especialidad: "" })); }}
        className={`w-full px-3.5 py-2.5 bg-[#ECF4FC] border-0 rounded-xl text-sm font-medium text-[#0A1733] outline-none focus:ring-2 ${errors.especialidad ? "ring-2 ring-[#CA0000]" : "focus:ring-[#0A1733]/20"}`}
      >
        <option value="">Seleccione especialidad</option>
        {especialidades.map((esp) => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
      </select>
      {errors.especialidad && <p className="text-[#CA0000] text-[11px] mt-1 flex items-center gap-1"><IoAlertCircleOutline className="w-3.5 h-3.5" />{errors.especialidad}</p>}
    </div>

    {/* Médico */}
    <div>
      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Médico Asignado *</label>
      <select
        value={medicoId}
        disabled={!especialidadId}
        onChange={(e) => { setMedicoId(e.target.value ? Number(e.target.value) : ""); if (errors.medico) setErrors((p) => ({ ...p, medico: "" })); }}
        className={`w-full px-3.5 py-2.5 bg-[#ECF4FC] border-0 rounded-xl text-sm font-medium text-[#0A1733] outline-none focus:ring-2 disabled:opacity-50 ${errors.medico ? "ring-2 ring-[#CA0000]" : "focus:ring-[#0A1733]/20"}`}
      >
        <option value="">Seleccione médico</option>
        {medicos.map((med) => <option key={med.id} value={med.id}>{med.nombreCompleto}</option>)}
      </select>
      {errors.medico && <p className="text-[#CA0000] text-[11px] mt-1 flex items-center gap-1"><IoAlertCircleOutline className="w-3.5 h-3.5" />{errors.medico}</p>}
    </div>

    {/* Fecha + Turno */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha de la Cita *</label>
        <input
          type="date"
          value={fecha}
          min={getTodayString()}
          onChange={(e) => { setFecha(e.target.value); if (errors.fecha) setErrors((p) => ({ ...p, fecha: "" })); }}
          className={`w-full px-3.5 py-2.5 bg-[#ECF4FC] border-0 rounded-xl text-sm font-medium text-[#0A1733] outline-none focus:ring-2 ${errors.fecha ? "ring-2 ring-[#CA0000]" : "focus:ring-[#0A1733]/20"}`}
        />
        {errors.fecha && <p className="text-[#CA0000] text-[11px] mt-1 flex items-center gap-1"><IoAlertCircleOutline className="w-3.5 h-3.5" />{errors.fecha}</p>}
      </div>
      <div>
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Turno</label>
        <div className="flex gap-2">
          {(["MANANA", "TARDE"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTurno(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                turno === t ? "bg-[#0A1733] text-white" : "bg-[#ECF4FC] text-slate-500 hover:bg-slate-200"
              }`}
            >
              {t === "MANANA" ? "Mañana" : "Tarde"}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Submit */}
    <div className="pt-2 flex justify-end">
      <button
        type="submit"
        disabled={isSaving || isCitaFormInvalid}
        className={`px-8 py-3 text-white font-black rounded-xl text-sm transition-all active:scale-[0.98] ${
          isSaving || isCitaFormInvalid ? "bg-slate-200 text-slate-400" : "bg-[#CA0000] hover:bg-[#a80000]"
        }`}
      >
        {isSaving ? "Guardando…" : "Guardar Cita →"}
      </button>
    </div>
  </form>
);

export default CitaDetails;
