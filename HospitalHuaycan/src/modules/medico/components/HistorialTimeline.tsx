import React, { useState, useEffect } from "react";
import {
  IoCalendarOutline, IoMedicalOutline, IoFlaskOutline,
  IoHeartHalfOutline, IoDocumentTextOutline, IoAlertCircleOutline,
  IoMedkitOutline,
} from "react-icons/io5";
import { AtencionPasada } from "../types";
import { obtenerHistorial } from "../services/atencionService";

interface Props {
  historiaClinicaId: number;
}

function parseSecondaryDiagnostics(val: string | null | undefined): string[] {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) {
      return parsed.map(v => String(v));
    }
  } catch {
    // Si no es JSON parseable, tratarlo como cadena separada por comas u otros
    return val.split(/[|,]/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

const HistorialTimeline: React.FC<Props> = ({ historiaClinicaId }) => {
  const [history, setHistory] = useState<AtencionPasada[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await obtenerHistorial(historiaClinicaId);
        setHistory(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar el historial médico");
      } finally {
        setIsLoading(false);
      }
    }
    if (historiaClinicaId) {
      loadHistory();
    }
  }, [historiaClinicaId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <div className="animate-spin w-5 h-5 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-2" />
        <span className="text-xs font-semibold">Cargando historial clínico...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[#CA0000] text-xs font-semibold">
        <IoAlertCircleOutline className="w-4 h-4 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
        <IoDocumentTextOutline className="w-8 h-8 mb-2" />
        <p className="text-xs font-bold uppercase tracking-wider">Sin antecedentes en el sistema</p>
        <p className="text-[11px] text-slate-400 mt-0.5">No se encontraron atenciones médicas previas para este paciente.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l border-slate-100 space-y-6">
      {history.map((item, idx) => {
        const dateObj = item.fechaAtencion ? new Date(item.fechaAtencion) : new Date();
        const formattedDate = dateObj.toLocaleDateString("es-PE", {
          day: "2-digit", month: "short", year: "numeric"
        });
        
        const secundarias = parseSecondaryDiagnostics(item.diagnosticosSecundarios);

        return (
          <div key={idx} className="relative group">
            {/* Indicador de línea de tiempo */}
            <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-white border-4 border-[#0A1733] flex items-center justify-center group-hover:border-[#CA0000] transition-colors" />

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Fecha y Especialidad */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                <div className="flex items-center gap-1.5 text-[#0A1733] font-black text-xs">
                  <IoCalendarOutline className="w-3.5 h-3.5 text-[#CA0000]" />
                  <span>{formattedDate}</span>
                </div>
                {item.diagnosticoCie10Principal && (
                  <span className="text-[10px] font-black bg-[#CA0000]/10 text-[#CA0000] px-2.5 py-0.5 rounded-full">
                    {item.diagnosticoCie10Principal}
                  </span>
                )}
              </div>

              {/* Contenido Clínico */}
              <div className="space-y-4">
                
                {/* Diagnóstico Principal */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Diagnóstico Principal</h4>
                  <p className="text-sm font-bold text-slate-800">
                    {item.diagnosticoCie10Principal ? `[${item.diagnosticoCie10Principal}] ` : ""}
                    {item.diagnosticoDescripcion || "Sin diagnóstico registrado"}
                  </p>
                </div>

                {/* Diagnósticos Secundarios */}
                {secundarias.length > 0 && (
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnósticos Secundarios</h5>
                    <div className="flex flex-wrap gap-1">
                      {secundarias.map((sec, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anamnesis y Examen Físico */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  {item.anamnesis && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Anamnesis</p>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{item.anamnesis}</p>
                    </div>
                  )}
                  {item.examenFisico && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Examen Físico</p>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{item.examenFisico}</p>
                    </div>
                  )}
                </div>

                {/* Tratamiento e indicaciones */}
                {(item.tratamiento || item.indicaciones) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.tratamiento && (
                      <div className="flex gap-2">
                        <IoMedicalOutline className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tratamiento</p>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{item.tratamiento}</p>
                        </div>
                      </div>
                    )}
                    {item.indicaciones && (
                      <div className="flex gap-2">
                        <IoDocumentTextOutline className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Indicaciones</p>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{item.indicaciones}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Solicitud de Exámenes */}
                {item.solicitudExamenes && (
                  <div className="flex gap-2 bg-blue-50/20 p-2.5 rounded-xl border border-blue-100/30">
                    <IoFlaskOutline className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Exámenes Solicitados</p>
                      <p className="text-xs text-slate-700 whitespace-pre-wrap">{item.solicitudExamenes}</p>
                    </div>
                  </div>
                )}

                {/* Receta Médica */}
                {item.recetas && item.recetas.length > 0 && (
                  <div className="flex gap-2.5 bg-emerald-50/15 p-3.5 rounded-xl border border-emerald-100/30">
                    <IoMedkitOutline className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-2">Receta Médica (Medicamentos)</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.recetas.map((rec, rIdx) => (
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

                {/* Signos Vitales */}
                <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                  <IoHeartHalfOutline className="w-4 h-4 text-[#CA0000]" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Triaje:</p>
                  <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                    <span>PA: {item.paSistolica}/{item.paDiastolica} mmHg</span>
                    <span>•</span>
                    <span>FC: {item.fc} lpm</span>
                    <span>•</span>
                    <span>Temp: {item.temperatura} °C</span>
                    <span>•</span>
                    <span>SpO2: {item.spo2}%</span>
                    <span>•</span>
                    <span>Peso: {item.peso} kg</span>
                    <span>•</span>
                    <span>IMC: {item.imc}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistorialTimeline;
