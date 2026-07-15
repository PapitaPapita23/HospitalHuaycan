import { ReactNode } from "react";
import { IoAlertCircleOutline, IoRefreshOutline } from "react-icons/io5";

interface HomeShellProps {
  headerAction?: ReactNode;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;
}

export default function HomeShell({ headerAction, isLoading, error, onRetry, children }: HomeShellProps) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#CA0000] mb-1">
            Panel General
          </p>
          <h2 className="text-[2rem] font-black text-[#0A1733] leading-none tracking-tight">
            Inicio
          </h2>
        </div>
        {headerAction}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-44 text-slate-450">
          <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#CA0000] rounded-full mr-3" />
          Cargando…
        </div>
      ) : error ? (
        <div className="flex flex-col gap-3 bg-red-50 border border-red-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-[#CA0000]">
            <IoAlertCircleOutline className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 self-start text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors bg-white px-3.5 py-2 border rounded-xl"
          >
            <IoRefreshOutline className="w-4 h-4" /> Reintentar
          </button>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
