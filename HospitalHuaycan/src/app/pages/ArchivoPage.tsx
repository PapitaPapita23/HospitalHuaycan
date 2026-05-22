import React, { useRef } from "react";
import { IoSearchOutline, IoFolderOpenOutline, IoAlertCircleOutline } from "react-icons/io5";
import { useArchivoSearch } from "../../modules/archivo/hooks/useArchivoSearch";
import PatientDataCard from "../../modules/archivo/components/PatientDataCard";

const ArchivoPage: React.FC = () => {
  const { query, setQuery, result, isSearching, notFound, error, handleSearch, handleReset } =
    useArchivoSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toLocaleDateString("es-PE", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#CA0000]/10 rounded-xl">
            <IoFolderOpenOutline className="w-6 h-6 text-[#CA0000]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#0A1733]">Archivo Clínico</h2>
            <p className="text-xs font-semibold text-[#CA0000] capitalize">{today}</p>
          </div>
        </div>
      </div>

      {/* ── Search card ── */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Buscar por DNI, N° Historia Clínica o Nombre
        </p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ej.: 71234567, HC-0001 o Juan Pérez…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium
                         text-[#0A1733] placeholder-slate-400 focus:outline-none focus:ring-2
                         focus:ring-[#CA0000]/30 focus:border-[#CA0000] transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-[#CA0000] hover:bg-[#a80000] disabled:opacity-40 disabled:cursor-not-allowed
                       text-white text-sm font-bold rounded-xl transition-colors"
          >
            {isSearching ? "Buscando…" : "Buscar"}
          </button>
        </div>
      </div>

      {/* ── States ── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <IoAlertCircleOutline className="w-5 h-5 text-[#CA0000] shrink-0" />
          <p className="text-sm font-medium text-[#CA0000]">{error}</p>
        </div>
      )}

      {notFound && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm px-6 py-10 text-center">
          <IoFolderOpenOutline className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-500">
            No se encontró ningún paciente con «{query}».
          </p>
          <button
            onClick={handleReset}
            className="mt-3 text-xs font-bold text-[#CA0000] hover:underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {result && <PatientDataCard patient={result} onReset={handleReset} />}

    </div>
  );
};

export default ArchivoPage;
