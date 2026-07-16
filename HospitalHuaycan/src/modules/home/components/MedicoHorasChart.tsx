import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { CitaMedico } from "../../medico/types";
import ChartCard from "./ChartCard";

interface MedicoHorasChartProps {
  agenda: CitaMedico[];
}

const COLOR = "#2a78d6";

export default function MedicoHorasChart({ agenda }: MedicoHorasChartProps) {
  const counts = new Map<string, number>();
  agenda.forEach((cita) => {
    const hora = (cita.horaInicio || "").slice(0, 2);
    if (!hora) return;
    const label = `${hora}:00`;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  const data = [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hora, total]) => ({ hora, total }));

  return (
    <ChartCard
      title="Mis citas por hora"
      subtitle="Hoy"
      isEmpty={data.length === 0}
      emptyMessage="No tienes citas registradas hoy"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 16, left: -18, bottom: 4 }}>
          <CartesianGrid horizontal vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="hora" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, "Citas"]} cursor={{ fill: "#f1f5f9" }} />
          <Bar dataKey="total" fill={COLOR} radius={[4, 4, 0, 0]} barSize={28}>
            <LabelList dataKey="total" position="top" style={{ fontSize: 11, fill: "#0A1733", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
