import { supabase } from "../../../lib/supabase";
import { CitaMedico } from "../types";

export async function getAgendaHoy(): Promise<CitaMedico[]> {
  const userId = localStorage.getItem("userId");
  if (!userId) throw new Error("Sesión no iniciada");

  const { data, error } = await supabase.rpc("get_agenda_medico_hoy", {
    p_usuario_id: Number(userId),
  });

  if (error) throw new Error(error.message);
  return (data as CitaMedico[]) ?? [];
}
