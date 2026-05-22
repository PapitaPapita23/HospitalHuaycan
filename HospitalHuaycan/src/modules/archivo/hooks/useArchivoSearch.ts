import { useState } from "react";
import { PacienteBusqueda } from "../types";
import { buscarPaciente } from "../services/archivoService";

export function useArchivoSearch() {
  const [query, setQuery]           = useState("");
  const [result, setResult]         = useState<PacienteBusqueda | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound]     = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setIsSearching(true);
    setNotFound(false);
    setError(null);
    setResult(null);

    try {
      const data = await buscarPaciente(q);
      if (data) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setNotFound(false);
    setError(null);
  };

  return { query, setQuery, result, isSearching, notFound, error, handleSearch, handleReset };
}
