import React, { useState } from "react";
import { IoCloseOutline, IoChevronDownOutline } from "react-icons/io5";
import { CitaMedico, AtencionPasada } from "../types";

interface Props {
  cita: CitaMedico;
  onClose: () => void;
}

const VITAL = ({ label, value, unit }: { label: string; value: number | string; unit?: string }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-base font-black text-[#0A1733] mt-0.5">
      {value ?? "—"}{unit && <span className="text-xs font-semibold text-slate-400 ml-0.5">{unit}</span>}
    </p>
  </div>
);

const SECTION = ({ title, content }: { title: string; content?: string }) =>
  content ? (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  ) : null;

function AtencionAccordion({ a, idx }: { a: AtencionPasada; idx: number }) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Atención</p>
          <p className="text-sm font-bold text-[#0A1733]">
            {a.fechaAtencion
              ? new Date(a.fechaAtencion).toLocaleDateString("es-PE", {
                  day: "2-digit", month: "long", year: "numeric",
                })
              : "Fecha no disponible"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {a.diagnosticoCie10Principal && (
            <span className="text-[11px] font-bold bg-[#CA0000]/10 text-[#CA0000] px-2 py-0.5 rounded-full">
              {a.diagnosticoCie10Principal}
            </span>
          )}
          <IoChevronDownOutline
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 py-5 space-y-5">
          {/* Signos vitales */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Signos Vitales</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <VITAL label="FR"    value={a.fr}          unit="rpm" />
              <VITAL label="FC"    value={a.fc}          unit="bpm" />
              <VITAL label="Temp"  value={a.temperatura} unit="°C" />
              <VITAL label="PA"    value={`${a.paSistolica}/${a.paDiastolica}`} unit="mmHg" />
              <VITAL label="SpO₂"  value={a.spo2}        unit="%" />
              <VITAL label="Peso"  value={a.peso}        unit="kg" />
              <VITAL label="Talla" value={a.talla}       unit="cm" />
              <VITAL label="IMC"   value={a.imc} />
            </div>
            {a.escalaDolor != null && (
              <div className="mt-3 flex items-center gap-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Escala de dolor</p>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center
                        ${i < a.escalaDolor
                          ? "bg-[#CA0000] text-white"
                          : "bg-slate-100 text-slate-400"}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clínica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SECTION title="Anamnesis"    content={a.anamnesis} />
            <SECTION title="Examen físico" content={a.examenFisico} />
          </div>

          {/* Diagnóstico */}
          <div className="bg-[#CA0000]/5 border border-[#CA0000]/20 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#CA0000]">Diagnóstico</p>
            <p className="text-sm font-bold text-[#0A1733]">
              {a.diagnosticoCie10Principal
                ? `[${a.diagnosticoCie10Principal}] ${a.diagnosticoDescripcion}`
                : a.diagnosticoDescripcion ?? "—"}
            </p>
            {a.diagnosticosSecundarios && (
              <p className="text-xs text-slate-500">Secundarios: {a.diagnosticosSecundarios}</p>
            )}
          </div>

          {/* Tratamiento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SECTION title="Tratamiento"       content={a.tratamiento} />
            <SECTION title="Indicaciones"      content={a.indicaciones} />
            <SECTION title="Solicitud exámenes" content={a.solicitudExamenes} />
          </div>
        </div>
      )}
    </div>
  );
}

const HistorialModal: React.FC<Props> = ({ cita, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-[#0A1733] px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">
              Historial Clínico
            </p>
            <p className="text-base font-black text-white">{cita.pacienteNombres}</p>
            <p className="text-xs text-white/50">DNI {cita.pacienteDni}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <IoCloseOutline className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-3">
          {cita.historialConsultas.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Sin atenciones previas registradas.</p>
          ) : (
            cita.historialConsultas.map((a, i) => (
              <AtencionAccordion key={i} a={a} idx={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialModal;
