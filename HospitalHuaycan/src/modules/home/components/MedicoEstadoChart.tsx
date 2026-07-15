import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Rectangle } from "recharts";
import { ConteoItem } from "../types";
import ChartCard from "./ChartCard";

interface MedicoEstadoChartProps {
  data: ConteoItem[];
}

const ETAPA_INFO: Record<string, { label: string; color: string }> = {
  PENDIENTE:   { label: "Pendiente", color: "#86b6ef" },
  EN_CONSULTA: { label: "En Consulta", color: "#2a78d6" },
  ATENDIDO:    { label: "Atendido", color: "#184f95" },
};

export default function MedicoEstadoChart({ data }: MedicoEstadoChartProps) {
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const chartData = data.map((d) => ({ ...d, label: ETAPA_INFO[d.etiqueta]?.label ?? d.etiqueta }));

  return (
    <ChartCard
      title="Mis citas por estado"
      subtitle="Hoy"
      isEmpty={total === 0}
      emptyMessage="No tienes citas registradas hoy"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 20, right: 16, left: -18, bottom: 4 }}>
          <CartesianGrid horizontal vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value: number) => [`${value}`, "Citas"]} cursor={{ fill: "#f1f5f9" }} />
          <Bar
            dataKey="total"
            radius={[4, 4, 0, 0]}
            barSize={44}
            shape={(props: any) => (
              <Rectangle {...props} fill={ETAPA_INFO[props.payload.etiqueta]?.color ?? "#94a3b8"} />
            )}
          >
            <LabelList dataKey="total" position="top" style={{ fontSize: 11, fill: "#0A1733", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
