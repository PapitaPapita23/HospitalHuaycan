import React, { useState } from "react";
import {
  IoCloseOutline, IoChevronDownOutline, IoHeartOutline,
  IoDocumentTextOutline, IoMedkitOutline, IoFlaskOutline,
} from "react-icons/io5";
import { CitaMedico, AtencionPasada } from "../types";

interface Props {
  cita: CitaMedico;
  onClose: () => void;
}

function toSafeString(val: unknown): string | null {
  if (val == null) return null;
  if (typeof val === "string") return val.trim() || null;
  if (Array.isArray(val)) {
    const items = val
      .map((v: unknown) =>
        typeof v === "object" && v !== null
          ? Object.values(v as Record<string, unknown>).join(" · ")
          : String(v)
      )
      .filter(Boolean);
    return items.length ? items.join(" | ") : null;
  }
  if (typeof val === "object") return JSON.stringify(val).replace(/\\n/g, '\n');
  return String(val).replace(/\\n/g, '\n');
}

const Vital = ({ label, value, unit }: { label: string; value: number | string | null | undefined; unit?: string }) => (
  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <p className="text-sm font-black text-[#0A1733] mt-0.5 leading-tight">
      {value != null ? value : "—"}
      {unit && value != null && (
        <span className="text-[10px] font-semibold text-slate-400 ml-0.5">{unit}</span>
      )}
    </p>
  </div>
);

const Section = ({ title, content, icon }: { title: string; content?: string | null; icon?: React.ReactNode }) =>
  content ? (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</p>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  ) : null;

function AtencionAccordion({ a, idx }: { a: AtencionPasada; idx: number }) {
  const [open, setOpen] = useState(idx === 0);
  const secundariosStr = toSafeString(a.diagnosticosSecundarios);

  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="w-8 h-8 rounded-full bg-[#0A1733] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-white">{String(idx + 1).padStart(2, "0")}</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Atencion</p>
            <p className="text-sm font-bold text-[#0A1733]">
              {a.fechaAtencion
                ? new Date(a.fechaAtencion).toLocaleDateString("es-PE", {
                    day: "2-digit", month: "long", year: "numeric",
                  })
                : "Fecha no disponible"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {a.diagnosticoCie10Principal && (
            <span className="text-[11px] font-bold bg-[#CA0000]/10 text-[#CA0000] px-2.5 py-1 rounded-full">
              {a.diagnosticoCie10Principal}
            </span>
          )}
          <IoChevronDownOutline
            className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 py-5 space-y-5 bg-white">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <IoHeartOutline className="w-3.5 h-3.5 text-[#CA0000]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Signos Vitales</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Vital label="FR"    value={a.fr}          unit="rpm" />
              <Vital label="FC"    value={a.fc}          unit="bpm" />
              <Vital label="Temp"  value={a.temperatura} unit="C" />
              <Vital label="PA"    value={a.paSistolica != null ? `${a.paSistolica}/${a.paDiastolica}` : null} unit="mmHg" />
              <Vital label="SpO2"  value={a.spo2}        unit="%" />
              <Vital label="Peso"  value={a.peso}        unit="kg" />
              <Vital label="Talla" value={a.talla}       unit="cm" />
              <Vital label="IMC"   value={a.imc} />
            </div>
            {a.escalaDolor != null && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 shrink-0">Escala de dolor</p>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center ${i < (a.escalaDolor ?? 0) ? "bg-[#CA0000] text-white" : "bg-slate-100 text-slate-400"}`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(a.anamnesis || a.examenFisico) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-50">
              <Section title="Anamnesis"    content={toSafeString(a.anamnesis)}    icon={<IoDocumentTextOutline className="w-3 h-3 text-slate-400" />} />
              <Section title="Examen fisico" content={toSafeString(a.examenFisico)} icon={<IoDocumentTextOutline className="w-3 h-3 text-slate-400" />} />
            </div>
          )}

          {(a.diagnosticoCie10Principal || a.diagnosticoDescripcion) && (
            <div className="bg-[#CA0000]/5 border border-[#CA0000]/20 rounded-xl p-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#CA0000]">Diagnostico</p>
              <p className="text-sm font-bold text-[#0A1733]">
                {a.diagnosticoCie10Principal
                  ? `[${a.diagnosticoCie10Principal}] ${a.diagnosticoDescripcion ?? ""}`
                  : (a.diagnosticoDescripcion ?? "—")}
              </p>
              {secundariosStr && (
                <p className="text-xs text-slate-500">Secundarios: {secundariosStr}</p>
              )}
            </div>
          )}

          {(a.tratamiento || a.indicaciones || a.solicitudExamenes) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-slate-50">
              <Section title="Tratamiento"       content={toSafeString(a.tratamiento)}       icon={<IoMedkitOutline        className="w-3 h-3 text-slate-400" />} />
              <Section title="Indicaciones"      content={toSafeString(a.indicaciones)}      icon={<IoDocumentTextOutline  className="w-3 h-3 text-slate-400" />} />
              <Section title="Solicitud examenes" content={toSafeString(a.solicitudExamenes)} icon={<IoFlaskOutline          className="w-3 h-3 text-slate-400" />} />
            </div>
          )}

          {/* Receta Médica */}
          {a.recetas && a.recetas.length > 0 && (
            <div className="pt-3 border-t border-slate-50">
              <div className="flex items-center gap-1.5 mb-2">
                <IoMedkitOutline className="w-3.5 h-3.5 text-emerald-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Receta Médica</p>
              </div>
              <div className="bg-emerald-50/10 border border-emerald-100/30 rounded-xl p-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {a.recetas.map((rec, rIdx) => (
                    <div key={rIdx} className="bg-white border border-slate-100 rounded-lg p-2.5 shadow-sm flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {rec.medicamento} {rec.concentracion && <span className="text-[10px] text-slate-500 font-normal">({rec.concentracion})</span>}
                        </p>
                        {rec.forma_farmaceutica && (
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{rec.forma_farmaceutica}</p>
                        )}
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 p-1 px-1.5 rounded-md border border-slate-100/50">
                          <span>Dosis: {rec.dosis}</span>
                          <span className="text-slate-300">•</span>
                          <span>Frec: {rec.frecuencia}</span>
                          <span className="text-slate-300">•</span>
                          <span>Días: {rec.duracion_dias} d</span>
                        </div>
                      </div>
                      {rec.indicaciones_especiales && (
                        <p className="text-[10px] text-slate-500 italic mt-2 border-t border-slate-50 pt-1">
                          {rec.indicaciones_especiales}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const HistorialModal: React.FC<Props> = ({ cita, onClose }) => {
  const [filterYear, setFilterYear] = useState<string>("");

  const availableYears = Array.from(new Set(
    cita.documentosEscaneados?.map((doc: any) => 
      doc.fechaDocumento ? new Date(doc.fechaDocumento).getFullYear().toString() : new Date(doc.fechaSubida).getFullYear().toString()
    ) || []
  )).sort((a, b) => Number(b) - Number(a));

  const filteredDocs = cita.documentosEscaneados?.filter((doc: any) => {
    if (!filterYear) return true;
    const year = doc.fechaDocumento ? new Date(doc.fechaDocumento).getFullYear().toString() : new Date(doc.fechaSubida).getFullYear().toString();
    return year === filterYear;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        <div className="bg-[#0A1733] px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Historial Clinico</p>
            <p className="text-base font-black text-white">{cita.pacienteNombres}</p>
            <p className="text-xs text-white/50 mt-0.5">DNI {cita.pacienteDni}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold bg-white/10 text-white/70 px-3 py-1 rounded-full">
              {cita.historialConsultas.length} atencion{cita.historialConsultas.length !== 1 ? "es" : ""}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <IoCloseOutline className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-3 bg-[#ECF4FC]">
          {/* SECCIÓN DE DOCUMENTOS ANTIGUOS ESCANEADOS */}
          {cita.documentosEscaneados && cita.documentosEscaneados.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                <h3 className="text-sm font-bold text-[#0A1733] flex items-center gap-2">
                  <IoDocumentTextOutline className="w-5 h-5 text-blue-600" />
                  Documentos Históricos Escaneados
                </h3>
                {availableYears.length > 0 && (
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <option value="">Todos los años</option>
                    {availableYears.map(y => (
                      <option key={String(y)} value={String(y)}>{String(y)}</option>
                    ))}
                  </select>
                )}
              </div>
              
              {filteredDocs && filteredDocs.length === 0 ? (
                <div className="text-center py-4 text-xs font-medium text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                  No hay documentos subidos para el año {filterYear}.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDocs?.map((doc: any) => (
                    <a
                      key={doc.id}
                      href={doc.urlArchivo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                        <IoDocumentTextOutline className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate" title={doc.nombreArchivo}>
                          {doc.nombreArchivo}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {doc.fechaDocumento ? `Documento del: ${new Date(doc.fechaDocumento).toLocaleDateString("es-PE", { year: 'numeric', month: 'short', day: 'numeric' })}` : `Subido el: ${new Date(doc.fechaSubida).toLocaleDateString("es-PE")}`} • Ver PDF
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECCIÓN DE ATENCIONES PREVIAS (SISTEMA) */}
          <h3 className="text-sm font-bold text-[#0A1733] mb-3 pt-2">
            Atenciones Previas en Sistema
          </h3>
          {cita.historialConsultas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400 bg-white rounded-2xl border border-slate-100">
              <IoDocumentTextOutline className="w-10 h-10" />
              <p className="text-sm font-medium">Sin atenciones previas registradas.</p>
            </div>
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
