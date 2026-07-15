import { useState, useRef, useEffect } from "react";
import { IoCalendarOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { toISODate as toISO, parseISODate as parseISO, todayISODate } from "../dateUtils";

interface CalendarPopoverProps {
  selectedDate: string | null;
  onSelectDate: (fecha: string | null) => void;
}

const DIAS_SEMANA = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function buildMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
  return Array.from(
    { length: 42 },
    (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  );
}

export default function CalendarPopover({ selectedDate, onSelectDate }: CalendarPopoverProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const initial = selectedDate ? parseISO(selectedDate) : today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const todayISO = todayISODate();
  const cells = buildMonthGrid(viewYear, viewMonth);

  const goToPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const goToNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const handlePickDay = (d: Date) => {
    const iso = toISO(d);
    onSelectDate(iso === todayISO ? null : iso);
    setOpen(false);
  };

  const buttonLabel =
    selectedDate && selectedDate !== todayISO
      ? parseISO(selectedDate).toLocaleDateString("es-PE", { day: "numeric", month: "short" })
      : "Calendario";

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`self-start sm:self-auto flex items-center gap-2 py-2.5 px-5 text-white text-sm font-bold rounded-xl transition-all duration-150 shadow-sm active:scale-95 ${
          open ? "bg-[#132449]" : "bg-[#0A1733] hover:bg-[#132449]"
        }`}
      >
        <IoCalendarOutline className="w-4 h-4" />
        {buttonLabel}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <IoChevronBackOutline className="w-4 h-4" />
            </button>
            <p className="text-sm font-bold text-[#0A1733]">
              {MESES[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <IoChevronForwardOutline className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {DIAS_SEMANA.map((d) => (
              <span key={d} className="text-[10px] font-bold uppercase text-slate-400">
                {d}
              </span>
            ))}
            {cells.map((d) => {
              const iso = toISO(d);
              const inMonth = d.getMonth() === viewMonth;
              const isToday = iso === todayISO;
              const isSelected = selectedDate ? iso === selectedDate : isToday;
              return (
                <button
                  type="button"
                  key={iso}
                  onClick={() => handlePickDay(d)}
                  className={[
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                    !inMonth ? "text-slate-300" : "text-slate-700",
                    isSelected
                      ? "bg-[#0A1733] text-white"
                      : isToday
                        ? "border border-[#CA0000] text-[#CA0000]"
                        : "hover:bg-slate-100",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectDate(null);
              setOpen(false);
            }}
            className="mt-3 w-full text-center text-xs font-bold text-slate-500 transition-colors hover:text-[#0A1733]"
          >
            Ir a hoy
          </button>
        </div>
      )}
    </div>
  );
}
