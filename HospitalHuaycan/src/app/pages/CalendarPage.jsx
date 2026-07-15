import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  IoCalendarOutline,
  IoChevronBack,
  IoChevronForward,
  IoAlertCircleOutline,
  IoRefreshOutline,
  IoSunnyOutline,
  IoPartlySunnyOutline,
  IoTicketOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { apiGet } from "../../lib/apiClient";
import { AuthContext } from "../../modules/auth/context/AuthContext";
import { toISODate, parseISODate, todayISODate } from "../../modules/home/dateUtils";

const WEEKDAYS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function estadoChipClasses(estado) {
  const e = (estado || "").toUpperCase();
  if (e.includes("PEND")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (e.includes("ATEND") || e.includes("COMPLET") || e.includes("FINAL"))
    return "bg-green-50 text-green-700 border-green-200";
  if (e.includes("CANCEL") || e.includes("ANUL")) return "bg-red-50 text-red-600 border-red-200";
  if (e.includes("TRIAJE")) return "bg-purple-50 text-purple-700 border-purple-200";
  if (e.includes("CONSULT")) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-slate-100 text-slate-600 border-slate-200";
}

export default function CalendarPage() {
  const { userRole } = useContext(AuthContext);
  const nombreCompleto = localStorage.getItem("nombreCompleto") || "";

  const [fecha, setFecha] = useState(todayISODate());
  const [viewDate, setViewDate] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });
  const [citas, setCitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [soloMias, setSoloMias] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiGet(`/citas?fecha=${fecha}`);
      setCitas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [fecha]);

  useEffect(() => {
    load();
  }, [load]);

  // Celdas del mes visible (semana inicia lunes)
  const monthCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, iso: toISODate(new Date(year, month, d)) });
    }
    return cells;
  }, [viewDate]);

  const citasVisibles = useMemo(() => {
    if (userRole !== "ROLE_MEDICO" || !soloMias || !nombreCompleto) return citas;
    return citas.filter(
      (c) => (c.medico || "").trim().toLowerCase() === nombreCompleto.trim().toLowerCase()
    );
  }, [citas, soloMias, userRole, nombreCompleto]);

  const countManana = citasVisibles.filter((c) => c.turno === "MANANA").length;
  const countTarde = citasVisibles.length - countManana;

  const monthLabel = capitalize(
    viewDate.toLocaleDateString("es-PE", { month: "long", year: "numeric" })
  );
  const selectedLabel = capitalize(
    parseISODate(fecha).toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  );

  const goToday = () => {
    const hoy = new Date();
    setFecha(todayISODate());
    setViewDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  };

  const shiftMonth = (delta) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  return (
    <section className="space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
            Agenda
          </p>
          <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
            Calendario de Citas
          </h2>
        </div>
        <button
          onClick={goToday}
          className="flex items-center gap-2 self-start sm:self-auto bg-white border border-slate-200 text-[#0A1733] px-4 py-2.5 rounded-xl text-xs font-bold hover:border-slate-300 transition-colors shadow-sm"
        >
          <IoCalendarOutline className="w-4 h-4 text-[#CA0000]" /> Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-4 items-start">
        {/* ── Calendario mensual ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0A1733]">{monthLabel}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => shiftMonth(-1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Mes anterior"
              >
                <IoChevronBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => shiftMonth(1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                aria-label="Mes siguiente"
              >
                <IoChevronForward className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1"
              >
                {d}
              </span>
            ))}
            {monthCells.map((cell, idx) =>
              cell === null ? (
                <span key={`empty-${idx}`} />
              ) : (
                <button
                  key={cell.iso}
                  onClick={() => setFecha(cell.iso)}
                  className={`h-9 w-9 mx-auto rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                    fecha === cell.iso
                      ? "bg-[#CA0000] text-white shadow-md"
                      : cell.iso === todayISODate()
                      ? "border-2 border-[#CA0000]/40 text-[#0A1733] hover:bg-red-50"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cell.day}
                </button>
              )
            )}
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Selecciona un día para ver sus citas registradas en el sistema.
          </p>
        </div>

        {/* ── Citas del día ── */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0A1733]">{selectedLabel}</h3>
              <p className="text-[11px] text-slate-500">
                {citasVisibles.length}{" "}
                {citasVisibles.length === 1 ? "cita programada" : "citas programadas"}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <IoSunnyOutline className="w-3.5 h-3.5" /> Mañana: {countManana}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                <IoPartlySunnyOutline className="w-3.5 h-3.5" /> Tarde: {countTarde}
              </span>
              {userRole === "ROLE_MEDICO" && (
                <button
                  onClick={() => setSoloMias((prev) => !prev)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-colors ${
                    soloMias
                      ? "bg-[#0A1733] text-white border-[#0A1733]"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  Solo mis citas
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-3" />
                Cargando citas…
              </div>
            ) : error ? (
              <div className="flex flex-col gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 text-[#CA0000]">
                  <IoAlertCircleOutline className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
                <button
                  onClick={load}
                  className="flex items-center gap-1.5 self-start text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 border rounded-xl"
                >
                  <IoRefreshOutline className="w-4 h-4" /> Reintentar
                </button>
              </div>
            ) : citasVisibles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <IoCalendarOutline className="w-10 h-10 text-slate-200 mb-2" />
                <p className="text-sm font-bold text-slate-500">
                  No hay citas programadas para este día
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Las citas agendadas en Admisión aparecerán aquí automáticamente.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {citasVisibles.map((cita) => (
                  <div
                    key={cita.citaId ?? cita.id}
                    className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-blue-200 hover:bg-blue-50/30 transition-colors"
                  >
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg w-fit shrink-0 ${
                        cita.turno === "MANANA"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {cita.turno === "MANANA" ? (
                        <>
                          <IoSunnyOutline className="w-3.5 h-3.5" /> 8:00 am
                        </>
                      ) : (
                        <>
                          <IoPartlySunnyOutline className="w-3.5 h-3.5" /> 2:00 pm
                        </>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#0A1733] truncate">{cita.paciente}</p>
                      <p className="text-xs text-slate-500">
                        DNI {cita.dni} · {cita.especialidad}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <IoPersonCircleOutline className="w-3.5 h-3.5" /> {cita.medico}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${estadoChipClasses(
                          cita.estado
                        )}`}
                      >
                        {cita.estado}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <IoTicketOutline className="w-3.5 h-3.5" /> {cita.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
