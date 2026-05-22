import { supabase } from "../../../lib/supabase";
import { PacienteBusqueda } from "../types";

export async function buscarPaciente(query: string): Promise<PacienteBusqueda | null> {
  const q = query.trim();
  if (!q) return null;

  const { data, error } = await supabase.rpc("buscar_paciente_hc", { p_query: q });

  if (error) throw new Error(error.message);
  if (!data) return null;

  return data as PacienteBusqueda;
}
