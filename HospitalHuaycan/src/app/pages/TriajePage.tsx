import React, { useState, useEffect, useCallback } from "react";
import {
  IoHeartHalfOutline, IoRefreshOutline, IoAlertCircleOutline,
  IoHeartOutline, IoCheckmarkCircleOutline, IoChevronForwardOutline
} from "react-icons/io5";
import { CitaMedico } from "../../modules/medico/types";
import { obtenerAgendaHoyTodo } from "../../modules/medico/services/atencionService";
import TriajeForm from "../../modules/medico/components/TriajeForm";

const ESTADO_TRIAJE_STYLE: Record<string, string> = {
  PENDIENTE:   "bg-amber-50 text-amber-700 border border-amber-200",
  EN_CONSULTA: "bg-blue-50 text-blue-700 border border-blue-200",
  EN_ATENCION: "bg-blue-50 text-blue-700 border border-blue-200",
  FINALIZADO:  "bg-emerald-50 text-emerald-700 border border-emerald-200",
  ATENDIDO:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  CANCELADO:   "bg-slate-100 text-slate-500 border border-slate-200",
};

const ESTADO_TRIAJE_LABEL: Record<string, string> = {
  PENDIENTE:   "Pendiente Triaje",
  EN_CONSULTA: "Listo para Consulta",
  EN_ATENCION: "Listo para Consulta",
  FINALIZADO:  "Atención Finalizada",
  ATENDIDO:    "Atención Finalizada",
  CANCELADO:   "Cancelado",
};

const TriajePage: React.FC = () => {
  const [agenda, setAgenda] = useState<CitaMedico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCita, setSelectedCita] = useState<CitaMedico | null>(null);

  const loadAgenda = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerAgendaHoyTodo();
      setAgenda(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar la agenda de triaje.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [loadAgenda]);

  const handleTriajeSuccess = () => {
    setSelectedCita(null);
    loadAgenda();
  };

  const handleTriajeCancel = () => {
    setSelectedCita(null);
  };

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const total = agenda.length;
  const triados = agenda.filter((c) => c.estadoConsulta !== "PENDIENTE" && c.estadoConsulta !== "CANCELADO").length;
  const progreso = total > 0 ? Math.round((triados / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <IoHeartHalfOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0A1733]">Portal de Triaje y Enfermería</h2>
            <p className="text-xs font-semibold text-emerald-650 capitalize">{today}</p>
          </div>
        </div>
        {!selectedCita && (
          <button
            onClick={loadAgenda}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50
                       text-slate-650 text-sm font-bold rounded-xl transition-colors disabled:opacity-40"
          >
            <IoRefreshOutline className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        )}
      </div>

      {/* Renderizado Condicional del Formulario de Triaje u Hoja de Trabajo */}
      {selectedCita ? (
        <div className="space-y-4">
          <button
            onClick={handleTriajeCancel}
            className="text-xs font-bold text-[#0A1733] hover:text-[#CA0000] flex items-center gap-1.5 transition-colors"
          >
            ← Volver a la Lista de Citas
          </button>
          <TriajeForm
            cita={selectedCita}
            onSuccess={handleTriajeSuccess}
            onCancel={handleTriajeCancel}
          />
        </div>
      ) : (
        <>
          {/* Tarjeta de Estadísticas de Triaje del Día */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1 md:col-span-2 bg-[#0A1733] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between min-h-[120px] text-white">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/[0.04]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 z-10">
                Progreso del Triaje Diario
              </p>
              <div className="z-10 mt-2">
                <div className="flex justify-between text-[11px] text-white/40 font-semibold mb-1">
                  <span>Pacientes Triados: {triados} de {total}</span>
                  <span>{progreso}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
              <IoHeartOutline className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-[2.2rem] font-black text-[#0A1733] leading-none">
                  {agenda.filter(c => c.estadoConsulta === "PENDIENTE").length}
                </p>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Pendientes de triaje</p>
              </div>
            </div>
          </div>

          {/* Manejo de Errores */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4">
              <IoAlertCircleOutline className="w-5 h-5 text-[#CA0000] shrink-0" />
              <p className="text-sm font-medium text-[#CA0000]">{error}</p>
            </div>
          )}

          {/* Tabla de Citas */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pacientes Citados Hoy</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-44 text-slate-400">
                <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-emerald-500 rounded-full mr-3" />
                Cargando agenda de triaje…
              </div>
            ) : agenda.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 gap-2 text-slate-400">
                <p className="text-sm font-medium">No hay citas programadas para hoy.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {agenda.map((cita, idx) => (
                  <div
                    key={cita.citaId}
                    className="flex flex-wrap sm:flex-nowrap items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-all"
                  >
                    <span className="text-[11px] font-black text-slate-300 w-5 text-right hidden sm:inline">
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    {/* Hora */}
                    <div className="w-16">
                      <p className="text-sm font-black text-[#0A1733] font-mono leading-none">
                        {cita.horaInicio ? cita.horaInicio.slice(0, 5) : "—"}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">hrs</p>
                    </div>

                    {/* Paciente */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{cita.pacienteNombres}</p>
                      <p className="text-[11px] text-slate-400 font-semibold">DNI: {cita.pacienteDni}</p>
                    </div>

                    {/* Estado de Triaje */}
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase
                        ${ESTADO_TRIAJE_STYLE[cita.estadoConsulta] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}
                    >
                      {ESTADO_TRIAJE_LABEL[cita.estadoConsulta] ?? cita.estadoConsulta}
                    </span>

                    {/* Acción */}
                    <div className="w-full sm:w-auto text-right mt-2 sm:mt-0">
                      {cita.estadoConsulta === "PENDIENTE" ? (
                        <button
                          onClick={() => setSelectedCita(cita)}
                          className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                        >
                          Registrar Triaje
                          <IoChevronForwardOutline className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold flex items-center justify-end gap-1">
                          <IoCheckmarkCircleOutline className="w-4 h-4 text-emerald-500" />
                          Triado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TriajePage;
