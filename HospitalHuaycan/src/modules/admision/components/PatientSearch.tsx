import React from "react";
import { IoSearchOutline, IoAlertCircleOutline } from "react-icons/io5";
import { PatientState } from "../types";

interface PatientSearchProps {
  dniQuery: string;
  setDniQuery: (v: string) => void;
  patient: PatientState | null;
  patientNotFound: boolean;
  newPatientName: string;
  setNewPatientName: (v: string) => void;
  newPatientLastName: string;
  setNewPatientLastName: (v: string) => void;
  newPatientBirthDate: string;
  setNewPatientBirthDate: (v: string) => void;
  newPatientGenero: "M" | "F";
  setNewPatientGenero: (v: "M" | "F") => void;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSearching: boolean;
  isRegistering: boolean;
  onSearch: (e: React.FormEvent) => void;
  onRegister: () => void;
  onContinue: () => void;
}

const PatientSearch: React.FC<PatientSearchProps> = ({
  dniQuery, setDniQuery,
  patient, patientNotFound,
  newPatientName, setNewPatientName,
  newPatientLastName, setNewPatientLastName,
  newPatientBirthDate, setNewPatientBirthDate,
  newPatientGenero, setNewPatientGenero,
  errors, setErrors,
  isSearching, isRegistering,
  onSearch, onRegister, onContinue,
}) => (
  <div className="space-y-6">
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Paso 1 de 2</p>
      <h3 className="text-xl font-black text-[#0A1733] leading-tight">Identificar Paciente</h3>
      <p className="text-xs text-slate-400 mt-0.5">Busque por número de DNI en el sistema.</p>
    </div>

    {/* Búsqueda */}
    <form onSubmit={onSearch} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          maxLength={8}
          placeholder="DNI (8 dígitos)"
          value={dniQuery}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 8);
            setDniQuery(val);
            if (errors.dniQuery) setErrors((p) => ({ ...p, dniQuery: "" }));
          }}
          className={`w-full pl-10 pr-3 py-2.5 bg-[#ECF4FC] border-0 rounded-xl text-sm font-medium text-[#0A1733] placeholder:text-slate-400 outline-none transition-all focus:ring-2 ${
            errors.dniQuery ? "ring-2 ring-[#CA0000]" : "focus:ring-[#0A1733]/20"
          }`}
        />
        <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      </div>
      <button
        type="submit"
        disabled={isSearching || dniQuery.length !== 8}
        className="px-5 py-2.5 bg-[#0A1733] hover:bg-[#122854] disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold rounded-xl text-sm transition-all active:scale-95"
      >
        {isSearching ? "..." : "Buscar"}
      </button>
    </form>
    {errors.dniQuery && (
      <p className="text-[#CA0000] text-xs font-medium flex items-center gap-1 -mt-4">
        <IoAlertCircleOutline className="w-4 h-4 shrink-0" />
        {errors.dniQuery}
      </p>
    )}

    {/* Paciente encontrado */}
    {patient && !patientNotFound && (
      <div className="flex items-center gap-4 p-4 bg-[#0A1733] rounded-xl">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-black text-white">
            {patient.nombreCompleto.split(" ").slice(0, 2).map((n) => n[0]).join("")}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">Paciente identificado</p>
          <p className="font-black text-white text-sm leading-tight truncate">{patient.nombreCompleto}</p>
          <p className="text-[11px] text-white/50">
            {patient.dni}
            {patient.isNew && (
              <span className="ml-2 bg-[#CA0000]/80 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">Nuevo</span>
            )}
          </p>
        </div>
        <button
          onClick={onContinue}
          className="shrink-0 px-4 py-2 bg-[#CA0000] hover:bg-[#a80000] text-white font-bold rounded-lg text-xs transition-all active:scale-95"
        >
          Continuar →
        </button>
      </div>
    )}

    {/* Paciente no encontrado — registro rápido */}
    {patientNotFound && (
      <div className="space-y-5 pl-4 border-l-2 border-[#CA0000]">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#CA0000]">DNI no encontrado</p>
          <h4 className="text-sm font-black text-[#0A1733] mt-0.5">Registro rápido de nuevo paciente</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { label: "Nombre(s)",    value: newPatientName,      setter: setNewPatientName,      errKey: "newPatientName",      type: "text", placeholder: "Nombres"   },
            { label: "Apellido(s)",  value: newPatientLastName,   setter: setNewPatientLastName,  errKey: "newPatientLastName",  type: "text", placeholder: "Apellidos" },
            { label: "F. Nacimiento",value: newPatientBirthDate,  setter: setNewPatientBirthDate, errKey: "newPatientBirthDate", type: "date", placeholder: ""          },
          ] as const).map(({ label, value, setter, errKey, type, placeholder }) => (
            <div key={label}>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label} *</label>
              <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => { setter(e.target.value); if (errors[errKey]) setErrors((p) => ({ ...p, [errKey]: "" })); }}
                className={`w-full px-3.5 py-2.5 bg-[#ECF4FC] border-0 rounded-xl text-sm font-medium text-[#0A1733] outline-none focus:ring-2 ${
                  errors[errKey] ? "ring-2 ring-[#CA0000]" : "focus:ring-[#0A1733]/20"
                }`}
              />
              {errors[errKey] && <span className="text-[#CA0000] text-[11px] mt-1 block">{errors[errKey]}</span>}
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Género *</label>
            <div className="flex gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setNewPatientGenero(g)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    newPatientGenero === g ? "bg-[#0A1733] text-white" : "bg-[#ECF4FC] text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {g === "M" ? "Masculino" : "Femenino"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          disabled={isRegistering}
          onClick={onRegister}
          className="w-full py-2.5 bg-[#0A1733] hover:bg-[#122854] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
        >
          {isRegistering ? "Registrando..." : "Registrar y Continuar"}
        </button>
      </div>
    )}
  </div>
);

export default PatientSearch;
