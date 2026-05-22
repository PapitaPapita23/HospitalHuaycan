import React from "react";
import {
  IoPersonOutline, IoMedkitOutline, IoCalendarOutline,
  IoCheckmarkCircle, IoCloseCircle,
} from "react-icons/io5";
import { PacienteBusqueda } from "../types";

interface Props {
  patient: PacienteBusqueda;
  onReset: () => void;
}

const FIELD = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-[#0A1733] mt-0.5">{value}</p>
  </div>
);

const PatientDataCard: React.FC<Props> = ({ patient, onReset }) => {
  const nombreCompleto = `${patient.nombres} ${patient.apellidos}`;
  const initials = [patient.nombres, patient.apellidos]
    .map((n) => n?.[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="bg-[#0A1733] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#CA0000] flex items-center justify-center shrink-0">
            <span className="text-sm font-black text-white">{initials}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
              Historia Clínica #{patient.historiaClinicaId}
            </p>
            <p className="text-lg font-black text-white leading-tight">{nombreCompleto}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full
            ${patient.estadoSis ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
            {patient.estadoSis
              ? <><IoCheckmarkCircle className="w-3.5 h-3.5" /> SIS Activo</>
              : <><IoCloseCircle className="w-3.5 h-3.5" /> Sin SIS</>}
          </span>
        </div>
      </div>

      {/* Data grid */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-5">
        <FIELD label="DNI"            value={patient.dni} />
        <FIELD label="Edad"           value={`${patient.edad} años`} />
        <FIELD label="Género"         value={patient.genero ?? "—"} />
        <FIELD label="Grupo sanguíneo" value={patient.grupoSanguineo ?? "—"} />
        <FIELD
          label="Alergias"
          value={
            <span className={`inline-flex items-center gap-1 text-sm font-semibold
              ${patient.alergias ? "text-[#CA0000]" : "text-slate-400"}`}>
              <IoMedkitOutline className="w-4 h-4" />
              {patient.alergias || "Sin alergias registradas"}
            </span>
          }
        />
        <FIELD
          label="Expediente desde"
          value={
            <span className="flex items-center gap-1">
              <IoCalendarOutline className="w-4 h-4 text-slate-400" />
              {patient.fechaCreacionExpediente
                ? new Date(patient.fechaCreacionExpediente).toLocaleDateString("es-PE")
                : "—"}
            </span>
          }
        />
        <FIELD label="HC N°" value={`#${patient.historiaClinicaId}`} />
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="text-[11px] font-bold text-slate-400 hover:text-[#CA0000] underline underline-offset-2 transition-colors"
          >
            Nueva búsqueda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDataCard;
